/**
 * Processes tasks using a worker-pool pattern, ensuring that no more than
 * `limit` tasks are running concurrently. As each task completes, the next
 * pending task is started until all tasks have been processed.
 */


export async function runWithConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  limit: number,
  onResult: (result: T) => void,
): Promise<void> {
  if (limit < 1) {
    throw new Error('Concurrency limit must be at least 1');
  }

  let nextIndex = 0;
  let activeCount = 0;

  return new Promise((resolve) => {
    const startNext = () => {
      while (activeCount < limit && nextIndex < tasks.length) {
        const task = tasks[nextIndex];

        nextIndex++;
        activeCount++;

        task()
          .then(onResult)
          .finally(() => {
            activeCount--;

            if (nextIndex >= tasks.length && activeCount === 0) {
              resolve();
              return;
            }

            startNext();
          });
      }
    };

    startNext();
  });
}

/**
* Executes tasks while maintaining a fixed number
* of active promises.
*/