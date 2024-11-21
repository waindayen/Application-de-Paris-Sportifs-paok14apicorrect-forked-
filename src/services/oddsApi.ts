import axios from 'axios';

const BASE_URL = 'https://api.the-odds-api.com/v4/sports';
const STORAGE_KEY = 'odds_api_key';

export interface Sport {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
  has_outrights: boolean;
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

export interface Market {
  key: string;
  outcomes: Outcome[];
}

export interface Outcome {
  name: string;
  price: number;
}

export interface Event {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

class OddsApi {
  private apiKey: string;

  constructor() {
    this.apiKey = localStorage.getItem(STORAGE_KEY) || '';
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem(STORAGE_KEY, key);
  }

  getApiKey(): string {
    return this.apiKey;
  }

  async testConnection(apiKey: string): Promise<boolean> {
    try {
      const response = await axios.get(`${BASE_URL}`, {
        params: {
          apiKey: apiKey
        }
      });
      return response.status === 200;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Clé API invalide');
        }
        if (error.response?.status === 429) {
          throw new Error('Limite d\'API dépassée');
        }
      }
      throw new Error('Erreur de connexion à l\'API');
    }
  }

  private async request<T>(endpoint: string, params = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error('Clé API non configurée');
    }

    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        params: {
          apiKey: this.apiKey,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Clé API invalide');
        }
        if (error.response?.status === 429) {
          throw new Error('Limite d\'API dépassée');
        }
      }
      throw new Error('Erreur de connexion à l\'API');
    }
  }

  async getSports(): Promise<Sport[]> {
    return this.request<Sport[]>('/');
  }

  async getOdds(sportKey: string, regions = 'eu'): Promise<Event[]> {
    return this.request<Event[]>(`/${sportKey}/odds`, {
      regions,
      markets: 'h2h'
    });
  }

  async getLiveEvents(sportKey: string): Promise<Event[]> {
    return this.request<Event[]>(`/${sportKey}/odds-live`, {
      markets: 'h2h'
    });
  }

  async getScores(sportKey: string, daysFrom = 1): Promise<Event[]> {
    return this.request<Event[]>(`/${sportKey}/scores`, {
      daysFrom
    });
  }
}

export const oddsApi = new OddsApi();