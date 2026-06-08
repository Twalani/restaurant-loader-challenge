import { Response } from 'express';
import { fetchRestaurantDetails } from './api';
import { runWithConcurrency } from './concurrency';
import { list } from './restaurants';

export async function streamRestaurants(
  res: Response,
): Promise<void> {
  const total = list.length;
  let completed = 0;

// Send the restaurant list first so the client can render rows
// before individual restaurant details start streaming in.
  res.write(
    JSON.stringify({
      type: 'initial',
      total,
      restaurants: list,
    }) + '\n',
  );

  const tasks = list.map((restaurant) => {
    return async () => {
      try {
        const details = await fetchRestaurantDetails(restaurant.id);

        return {
          type: 'restaurant-update',
          restaurantId: restaurant.id,
          details,
        };
      } catch (error) {
        return {
          type: 'restaurant-error',
          restaurantId: restaurant.id,
          error:
            error instanceof Error
              ? error.message
              : 'Unknown error',
        };
      }
    };
  });

  await runWithConcurrency(
    tasks,
    5,
    (result) => {
      completed++;

      res.write(
        JSON.stringify({
          ...result,
          completed,
          total,
        }) + '\n',
      );
    },
  );

  res.write(
    JSON.stringify({
      type: 'complete',
      completed,
      total,
    }) + '\n',
  );

  res.end();
}

// Send the initial restaurant list so the UI can render immediately.