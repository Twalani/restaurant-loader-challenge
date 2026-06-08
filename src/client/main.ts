// Example client-side TypeScript code
import './styles.css';

interface ApiResponse {
  message: string;
}

interface RestaurantSummary {
  id: number;
  name: string;
  suburb: string;
  vertical: string;
}

interface StreamChunk {
  type:
    | 'initial'
    | 'restaurant-update'
    | 'restaurant-error'
    | 'complete';

  total?: number;
  completed?: number;

  restaurants?: RestaurantSummary[];

  restaurantId?: number;

  details?: {
    name: string;
    description: string;
    address?: {
      suburb?: string;
      town?: string;
    };
  };

  error?: string;
}

const testBtn = document.getElementById('testBtn') as HTMLButtonElement;
const resultDiv = document.getElementById('result') as HTMLDivElement;
const streamBtn = document.getElementById('streamBtn') as HTMLButtonElement;
const statusText = document.getElementById('statusText') as HTMLSpanElement;
const progressText = document.getElementById('progressText') as HTMLSpanElement;
const conclusionText = document.getElementById('conclusionText') as HTMLSpanElement;

testBtn?.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/hello');
    const data: ApiResponse = await response.json();
    resultDiv.textContent = `API Response: ${data.message}`;
  } catch (error) {
    resultDiv.textContent = 'Error calling API';
    console.error('Error:', error);
  }
});

// Cache row references so streamed updates can update a specific row
// without querying or traversing the DOM each time.
const rowMap = new Map<number, HTMLTableRowElement>();

streamBtn?.addEventListener('click', async () => {
  statusText.textContent = 'Streaming...';
  progressText.textContent = '-';
  conclusionText.textContent = '-';
  streamBtn.disabled = true;

  resultDiv.innerHTML = '';
  rowMap.clear();

  try {
    const response = await fetch('/api/restaurants/stream');

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Streaming chunks may split JSON messages across network boundaries.
      // Buffer partial data until a newline-delimited message is complete.
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');

      // Preserve the final incomplete line so it can be completed
      // by the next chunk from the stream.
      buffer = lines[lines.length - 1];

      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();

        if (line) {
          try {
            const chunk: StreamChunk = JSON.parse(line);
            chunkProcessor(chunk);
          } catch (parseError) {
            console.error('Failed to parse chunk:', line, parseError);
          }
        }
      }
    }

    statusText.textContent = 'Completed';
    streamBtn.disabled = false;
  } catch (error) {
    statusText.textContent = 'Error';
    console.error('Streaming error:', error);
    streamBtn.disabled = false;
  }
});

function chunkProcessor(chunk: StreamChunk) {
  if (chunk.type === 'initial') {
    progressText.textContent = `0 / ${chunk.total}`;

    resultDiv.innerHTML = `
      <table class="restaurant-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Suburb</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="restaurants-body"></tbody>
      </table>
    `;

    const tbody = document.getElementById(
      'restaurants-body',
    ) as HTMLTableSectionElement;

    chunk.restaurants?.forEach((restaurant) => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${restaurant.name}</td>
        <td>${restaurant.suburb}</td>
        <td class="loading">Loading...</td>
      `;

      tbody.appendChild(row);

      rowMap.set(restaurant.id, row);
    });

    return;
  }

  if (chunk.type === 'restaurant-update') {
    progressText.textContent =
      `${chunk.completed} / ${chunk.total}`;

    // Lookup is O(1) because rows were indexed during the initial payload.
    const row = rowMap.get(chunk.restaurantId!);

    if (row && chunk.details) {
      row.cells[2].textContent = 'Loaded';
      row.cells[2].className = 'loaded';
    }

    return;
  }

  if (chunk.type === 'restaurant-error') {
    progressText.textContent =
      `${chunk.completed} / ${chunk.total}`;

    const row = rowMap.get(chunk.restaurantId!);

    if (row) {
      row.cells[2].textContent = 'Error';
      row.cells[2].className = 'error';
    }

    return;
  }

  if (chunk.type === 'complete') {
    statusText.textContent = 'Completed';

    conclusionText.textContent =
      `loaded ${chunk.completed} of ${chunk.total}`;
  }
}

console.log('Client-side TypeScript loaded successfully!');