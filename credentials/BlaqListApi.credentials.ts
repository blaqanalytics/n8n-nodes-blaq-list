import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class BlaqListApi implements ICredentialType {
  displayName = 'BLAQ List API';
  documentationUrl = 'https://docs.blaqreports.com/blaq_list';
  name = 'blaqListApi';

  properties: INodeProperties[] = [
    {
      default: '',
      description: 'BLAQ List API Access Token',
      displayName: 'Token',
      name: 'token',
      required: true,
      type: 'string',
      typeOptions: {
        password: true
      },
    },
  ];

  authenticate = {
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.token}}',
      },
    },
    type: 'generic' as const,
  };
}
