import { useQuery } from 'react-query';
import { oddsApi, Sport, Event } from '../services/oddsApi';

export function useSports() {
  return useQuery<Sport[], Error>(
    'sports',
    () => oddsApi.getSports(),
    {
      retry: 2,
      staleTime: 300000, // 5 minutes
      enabled: !!oddsApi.getApiKey(),
      onError: (error) => {
        console.error('Failed to fetch sports:', error.message);
      }
    }
  );
}

export function useOdds(sportKey: string) {
  return useQuery<Event[], Error>(
    ['odds', sportKey],
    () => oddsApi.getOdds(sportKey),
    {
      retry: 2,
      staleTime: 60000, // 1 minute
      enabled: !!oddsApi.getApiKey(),
      onError: (error) => {
        console.error(`Failed to fetch odds for ${sportKey}:`, error.message);
      }
    }
  );
}

export function useLiveEvents(sportKey: string) {
  return useQuery<Event[], Error>(
    ['live-events', sportKey],
    () => oddsApi.getLiveEvents(sportKey),
    {
      retry: 1,
      refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
      staleTime: 10000, // 10 seconds
      enabled: !!oddsApi.getApiKey(),
      onError: (error) => {
        console.error(`Failed to fetch live events for ${sportKey}:`, error.message);
      }
    }
  );
}

export function useScores(sportKey: string) {
  return useQuery<Event[], Error>(
    ['scores', sportKey],
    () => oddsApi.getScores(sportKey),
    {
      retry: 2,
      staleTime: 60000, // 1 minute
      enabled: !!oddsApi.getApiKey(),
      onError: (error) => {
        console.error(`Failed to fetch scores for ${sportKey}:`, error.message);
      }
    }
  );
}