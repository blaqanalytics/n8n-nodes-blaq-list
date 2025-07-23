import {
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';

import {
  validateRequest,
  parseResponse,
} from '../GenericFunctions';

export class BlaqList implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'BLAQList',
    name: 'blaqList',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'BLAQList API',
    defaults: {
      name: 'BLAQList',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'blaqListApi',
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: 'http://api.lvh.me:3001/integration/v1',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    properties: [
      {
        default: 'score',
        displayName: 'Resource',
        name: 'resource',
        noDataExpression: true,
        options: [
          {
            name: 'Score',
            value: 'score',
          },
        ],
        type: 'options',
      },
      {
        default: 'scan',
        displayName: 'Operation',
        displayOptions: {
          show: {
            resource: ['score'],
          },
        },
        name: 'operation',
        noDataExpression: true,
        options: [
          {
            name: 'Scan',
            value: 'scan',
            description: 'Scan for chargebacks or fraud',
            action: 'Scan an order',
            routing: {
              request: {
                method: 'POST',
                url: '/blaq_list',
              },
              send: {
                preSend: [
                  validateRequest,
                ],
              },
              output: {
                postReceive: [
                  parseResponse,
                ]
              }
            },
          },
        ],
        type: 'options',
      },
      {
        name: 'first_name',
        default: '',
        description: 'First Name',
        displayName: 'First Name',
        type: 'string',
        routing: {
          send: {
            type: 'body',
            property: 'search[first_name]',
          }
        }
      },
      {
        name: 'last_name',
        default: '',
        description: 'Last Name',
        displayName: 'Last Name',
        type: 'string',
        routing: {
          send: {
            type: 'body',
            property: 'search[last_name]',
          }
        }
      },
      {
        name: 'email',
        default: '',
        description: 'Email',
        displayName: 'Email',
        type: 'string',
        routing: {
          send: {
            type: 'body',
            property: 'search[email]',
          }
        }
      },
      {
        name: 'card_prefix',
        default: '',
        description: 'Card BIN (First 6 Digits)',
        displayName: 'Card BIN',
        type: 'string',
        routing: {
          send: {
            type: 'body',
            property: 'search[card_prefix]',
          }
        }
      },
      {
        name: 'card_suffix',
        default: '',
        description: 'Card Last 4 Digits',
        displayName: 'Card Last 4',
        type: 'string',
        routing: {
          send: {
            type: 'body',
            property: 'search[card_suffix]',
          }
        }
      },
    ],
  };
}
