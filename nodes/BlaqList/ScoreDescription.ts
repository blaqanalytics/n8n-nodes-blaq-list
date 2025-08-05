import type { INodeProperties } from 'n8n-workflow';

const displayOptions = {
  get: {
    show: {
      operation: ['get'],
      resource: ['score'],
    },
  },
  operation: {
    show: {
      resource: ['score'],
    },
  },
};

export const operationProperties: INodeProperties[] = [
  {
    displayName: 'Operation',
    default: 'get',
    displayOptions: displayOptions.operation,
    name: 'operation',
    noDataExpression: true,
    options: [
      {
        action: 'Get score',
        description: 'Get Risk Score',
        name: 'Get Score',
        routing: {
          request: {
            method: 'POST',
            url: '/blaq_list',
          },
        },
        value: 'get',
      },
    ],
    type: 'options',
  },
];

export const getProperties: INodeProperties[] = [
  {
    displayName: 'Email',
    name: 'email',
    default: '',
    displayOptions: displayOptions.get,
    type: 'string',
    placeholder: 'name@email.com',
    required: true,
    routing: {
      send: {
        type: 'body',
        property: 'email',
      }
    }
  },
  {
    displayName: 'Additional Fields',
    default: {},
    displayOptions: displayOptions.get,
    name: 'additionalFields',
    options: [
      {
        displayName: 'Card BIN',
        default: '',
        description: 'Bank Identification Number (First 6 Digits of Card)',
        name: 'card_prefix',
        type: 'string',
        routing: {
          send: {
            type: 'body',
            property: 'card_prefix',
          }
        }
      },
      {
        displayName: 'Card Last 4',
        default: '',
        description: 'Card Last 4 Digits',
        name: 'card_suffix',
        type: 'string',
        routing: {
          send: {
            type: 'body',
            property: 'card_suffix',
          }
        }
      },
      {
        displayName: 'First Name',
        default: '',
        name: 'first_name',
        type: 'string',
        routing: {
          send: {
            type: 'body',
            property: 'first_name',
          }
        }
      },
      {
        displayName: 'Last Name',
        default: '',
        name: 'last_name',
        type: 'string',
        routing: {
          send: {
            type: 'body',
            property: 'last_name',
          }
        }
      },
    ],
    type: 'collection',
  },
];

export default {
  properties: {
    get: getProperties,
    operations: operationProperties,
  },
};
