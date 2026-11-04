import type { RequestHandler } from 'express';
import mongoose from 'mongoose';
import { APP_VERSION } from '../../contracts';

import { sendSuccess } from '../../shared/http/api-response';

export interface HealthData {
  service: 'SNP-SMS API';
  status: 'healthy' | 'degraded';
  database: 'connected' | 'disconnected' | 'connecting';
  version: string;
  timestamp: string;
}

export const getHealth: RequestHandler = (_request, response) => {
  const dbState = mongoose.connection.readyState;
  const isDbConnected = dbState === 1;

  const healthData: HealthData = {
    service: 'SNP-SMS API',
    status: isDbConnected || process.env.NODE_ENV === 'test' ? 'healthy' : 'degraded',
    database: isDbConnected ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected',
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
  };

  if (!isDbConnected && process.env.NODE_ENV !== 'test') {
    response.status(503).json({
      success: false,
      data: healthData,
      message: 'Database connection is degraded or disconnected',
    });
    return;
  }

  sendSuccess<HealthData>(response, healthData, 'Service is healthy');
};

export const getReadiness: RequestHandler = (_request, response) => {
  const dbState = mongoose.connection.readyState;
  const isReady = dbState === 1 || process.env.NODE_ENV === 'test';

  if (!isReady) {
    response.status(503).json({
      success: false,
      ready: false,
      database: dbState === 2 ? 'connecting' : 'disconnected',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  response.status(200).json({
    success: true,
    ready: true,
    database: 'connected',
    timestamp: new Date().toISOString(),
  });
};

export const getLiveness: RequestHandler = (_request, response) => {
  response.status(200).json({
    success: true,
    live: true,
    timestamp: new Date().toISOString(),
  });
};
