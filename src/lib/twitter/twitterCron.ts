import cron from 'node-cron';
import { publishScheduledPosts } from './publishScheduledPosts.js';


export const startCronJob = async () => {
  cron.schedule('* * * * *', async () => {
    console.log('Cron job ejecutado correctamente.');
    try {
      await publishScheduledPosts()
      console.log('Tarea completada exitosamente.');
    } catch (error) {
      console.error('Error al ejecutar la tarea programada:', error);
    }
  });
};

startCronJob();
