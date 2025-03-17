import useApi from '../model/api';
import { Api, Model } from '../model/interface';

export type Webhook = Model & {
  url: string;
  type: 'save' | 'edit' | 'corrupted' | 'forcesave';
  headers: Record<string, any>;
};

export type Header = {
  id: string;
  key: string;
  value: string;
};

export type WebhookApi = Api<Webhook> & {};

const useWebhookApi = (): WebhookApi => {
  const api = useApi<Webhook>('/office/doc/webhook');

  return { ...api };
};

export default useWebhookApi;
