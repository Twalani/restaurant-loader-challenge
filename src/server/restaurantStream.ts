import type { RestaurantDetails, Menu } from './api';

export interface RestaurantSummary {
  id: number;
  name: string;
  suburb: string;
  vertical: string;
}

// Initial payload sent to the client
export interface InitialMessage {
  type: 'initial';
  total: number;
  restaurants: RestaurantSummary[];
}

export interface RestaurantUpdateMessage {
  type: 'restaurant-update';
  restaurantId: number;
  completed: number;
  total: number;
  details: RestaurantDetails;
}

export interface RestaurantMenuMessage {
  type: 'menu-update';
  restaurantId: number;
  menu: Menu;
}

export interface RestaurantErrorMessage {
  type: 'restaurant-error';
  restaurantId: number;
  completed: number;
  total: number;
  error: string;
}

export interface CompleteMessage {
  type: 'complete';
  completed: number;
  total: number;
}

// Discriminated union representing every message that can be sent
// over the restaurant streaming endpoint.
export type RestaurantStreamMessage =
  | InitialMessage
  | RestaurantUpdateMessage
  | RestaurantMenuMessage
  | RestaurantErrorMessage
  | CompleteMessage;