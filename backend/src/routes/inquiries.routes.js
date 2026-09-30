import { Router } from 'express';
import { z } from 'zod';
import { rateLimit } from 'express-rate-limit';
import { validate } from '../middleware/validate.js';
import { optional, slug } from './schemas.js';
import { createInquiry } from '../services/inquiry.service.js';

// Field names match the website's InquiryForm. FormData sends everything as strings.
const inquiryBody = z.object({
  type: optional(z.enum(['booking', 'inquiry', 'custom'])).default('booking'),
  trip: optional(slug),
  fullName: z.string().trim().min(2, 'Please enter your name').max(120),
  email: z.email('Please enter a valid email').trim().toLowerCase().max(190),
  phone: optional(z.string().trim().max(40)),
  country: optional(z.string().trim().max(80)),
  travelDate: optional(z.iso.date('Use YYYY-MM-DD').transform((d) => new Date(d))),
  travellers: optional(z.coerce.number().int().min(1).max(500)),
  message: optional(z.string().trim().max(5000)),
  // Honeypot: a hidden field real visitors leave empty
  website: optional(z.string()),
});

// Stops form spam / abuse without affecting real visitors
const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: { message: 'Too many requests, please try again later.' } },
});

export const inquiriesRouter = Router().post('/', inquiryLimiter, validate({ body: inquiryBody }), async (req, res) => {
  const { website, ...data } = req.valid.body;

  // Bots fill the honeypot; pretend success so they don't retry
  if (website) return res.status(201).json({ data: { received: true } });

  const inquiry = await createInquiry(data, { ip: req.ip, userAgent: req.get('user-agent') });
  res.status(201).json({ data: { received: true, id: inquiry.id } });
});
