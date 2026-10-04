import { SocialQueueProducer } from './social-queue.producer';

/**
 * Tests del SocialQueueProducer.
 *
 * Mockeamos la Queue de BullMQ para no requerir Redis real.
 */

describe('SocialQueueProducer', () => {
  let producer: SocialQueueProducer;
  let mockQueue: any;
  let mockAdd: jest.Mock;
  let mockGetJobCounts: jest.Mock;
  let mockGetJob: jest.Mock;

  beforeEach(() => {
    mockAdd = jest.fn().mockResolvedValue({ id: 'job-123', attemptsMade: 0 });
    mockGetJobCounts = jest.fn().mockResolvedValue({
      waiting: 2,
      active: 1,
      completed: 10,
      failed: 0,
      delayed: 0,
      paused: 0,
    });
    mockGetJob = jest.fn();
    mockQueue = {
      add: mockAdd,
      getJobCounts: mockGetJobCounts,
      getJob: mockGetJob,
    };
    // Inyectamos el mock queue via cast any
    producer = new SocialQueueProducer(mockQueue as any);
  });

  describe('enqueue', () => {
    it('encola un job con datos validos', async () => {
      await producer.enqueue({
        publicationId: 'pub-1',
        plataforma: 'discord',
        payload: { evento: 'tutorial', data: { id: 't1' }, text: 'Hola' },
      });

      expect(mockAdd).toHaveBeenCalledWith(
        'publish',
        expect.objectContaining({
          publicationId: 'pub-1',
          plataforma: 'discord',
          payload: expect.objectContaining({ evento: 'tutorial' }),
        }),
        expect.any(Object),
      );
    });

    it('usa el publicationId como jobId por defecto para deduplicar', async () => {
      await producer.enqueue({
        publicationId: 'pub-abc',
        plataforma: 'x',
        payload: { evento: 'tutorial', data: {}, text: '' },
      });

      const callArgs = mockAdd.mock.calls[0];
      expect(callArgs[2].jobId).toBe('pub-abc');
    });

    it('permite sobreescribir el jobId via options', async () => {
      await producer.enqueue(
        {
          publicationId: 'pub-1',
          plataforma: 'discord',
          payload: { evento: 'tutorial', data: {}, text: '' },
        },
        { jobId: 'custom-job-id' },
      );

      expect(mockAdd.mock.calls[0][2].jobId).toBe('custom-job-id');
    });

    it('propaga errores del backend de la cola', async () => {
      mockAdd.mockRejectedValueOnce(new Error('Redis caido'));
      await expect(
        producer.enqueue({
          publicationId: 'pub-1',
          plataforma: 'discord',
          payload: { evento: 'tutorial', data: {}, text: '' },
        }),
      ).rejects.toThrow('Redis caido');
    });
  });

  describe('enqueueMany', () => {
    it('encola multiples items en paralelo', async () => {
      await producer.enqueueMany([
        { publicationId: 'p1', plataforma: 'discord', payload: { evento: 'tutorial', data: {}, text: '' } },
        { publicationId: 'p2', plataforma: 'x', payload: { evento: 'tutorial', data: {}, text: '' } },
        { publicationId: 'p3', plataforma: 'meta', payload: { evento: 'tutorial', data: {}, text: '' } },
      ]);

      expect(mockAdd).toHaveBeenCalledTimes(3);
    });
  });

  describe('getStats', () => {
    it('devuelve estadisticas de la cola', async () => {
      const stats = await producer.getStats();

      expect(stats).toEqual({
        waiting: 2,
        active: 1,
        completed: 10,
        failed: 0,
        delayed: 0,
        paused: 0,
      });
    });

    it('maneja contadores faltantes', async () => {
      mockGetJobCounts.mockResolvedValueOnce({ waiting: 5 });
      const stats = await producer.getStats();
      expect(stats.waiting).toBe(5);
      expect(stats.completed).toBe(0);
    });
  });

  describe('retryFailedJob', () => {
    it('reintenta un job existente', async () => {
      const mockRetry = jest.fn().mockResolvedValue(undefined);
      mockGetJob.mockResolvedValue({ id: 'job-1', retry: mockRetry });

      await producer.retryFailedJob('job-1');

      expect(mockGetJob).toHaveBeenCalledWith('job-1');
      expect(mockRetry).toHaveBeenCalled();
    });

    it('lanza error si el job no existe', async () => {
      mockGetJob.mockResolvedValueOnce(null);
      await expect(producer.retryFailedJob('no-existe')).rejects.toThrow(
        'Job no-existe no encontrado en la cola',
      );
    });
  });
});