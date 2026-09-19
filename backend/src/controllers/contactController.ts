import { Request, Response } from 'express';

export async function handleContactForm(req: Request, res: Response) {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required fields' });
    }

    // In a real application, send email notification or save to database
    return res.json({
      success: true,
      message: 'Thank you for contacting Spice & Ember. We have received your message and will respond shortly!'
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to process contact message' });
  }
}

export async function handleNewsletter(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    return res.json({
      success: true,
      message: 'Subscribed successfully! Welcome to Spice & Ember culinary updates.'
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to subscribe' });
  }
}
