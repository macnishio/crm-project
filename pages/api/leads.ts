import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getLeads(req, res);
    case 'POST':
      return createLead(req, res);
    case 'PUT':
      return updateLead(req, res);
    case 'DELETE':
      return deleteLead(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getLeads(req: NextApiRequest, res: NextApiResponse) {
  try {
    const leads = await prisma.lead.findMany();
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leads', error });
  }
}

async function createLead(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, email, status } = req.body;
    const lead = await prisma.lead.create({
      data: { name, email, status },
    });
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Error creating lead', error });
  }
}

async function updateLead(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, name, email, status } = req.body;
    const lead = await prisma.lead.update({
      where: { id },
      data: { name, email, status },
    });
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Error updating lead', error });
  }
}

async function deleteLead(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    await prisma.lead.delete({
      where: { id: String(id) },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lead', error });
  }
}