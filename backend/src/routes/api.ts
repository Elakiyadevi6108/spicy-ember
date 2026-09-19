import { Router } from 'express';
import {
  checkAvailability,
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation
} from '../controllers/reservationController.js';
import {
  getTables,
  createTable,
  updateTable,
  deleteTable
} from '../controllers/tableController.js';
import { login, register, me } from '../controllers/authController.js';
import { getMenuItems } from '../controllers/menuController.js';
import { getEvents } from '../controllers/eventsController.js';
import { handleContactForm, handleNewsletter } from '../controllers/contactController.js';

const router = Router();

// Availability & Reservations
router.get('/availability', checkAvailability);
router.post('/reservations', createReservation);
router.get('/reservations', getReservations);
router.get('/reservations/:id', getReservationById);
router.put('/reservations/:id', updateReservation);
router.delete('/reservations/:id', deleteReservation);

// Tables
router.get('/tables', getTables);
router.post('/tables', createTable);
router.put('/tables/:id', updateTable);
router.delete('/tables/:id', deleteTable);

// Auth
router.post('/auth/login', login);
router.post('/auth/register', register);
router.get('/auth/me', me);

// Public Content
router.get('/menu', getMenuItems);
router.get('/events', getEvents);
router.post('/contact', handleContactForm);
router.post('/newsletter', handleNewsletter);

export default router;
