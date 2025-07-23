import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class BlaqListApi implements ICredentialType {
  name = 'blaqListApi';
  displayName = 'BLAQList API';
  properties: INodeProperties[] = [
    {
      displayName: 'API Token',
      name: 'apiToken',
      type: 'string',
      typeOptions: { password: true },
      default: '',
    },
  ];

  authenticate = {
    type: 'generic' as const,
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiToken}}',
      },
    },
  };
}
