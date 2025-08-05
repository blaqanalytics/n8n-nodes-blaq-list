import { NodeConnectionType } from 'n8n-workflow';
import type { INodeProperties, INodeType, INodeTypeDescription } from 'n8n-workflow';
import scores from './ScoreDescription';

const API_URL: string = 'https://api.blaqreports.com/integration/v1';
const resourceProperties: INodeProperties[] = [
  {
    displayName: 'Resource',
    default: 'score',
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
];

export class BlaqList implements INodeType {
  description: INodeTypeDescription = {
    credentials: [
      {
        name: 'blaqListApi',
        required: true,
      },
    ],
    defaults: {
      name: 'BLAQ List',
    },
    description: 'BLAQ List API',
    displayName: 'BLAQ List',
    group: ['transform'],
    inputs: [NodeConnectionType.Main],
    name: 'blaqList',
    outputs: [NodeConnectionType.Main],
    properties: [
      ...resourceProperties,
      ...scores.properties.operations,
      ...scores.properties.get,
    ],
    requestDefaults: {
      baseURL: API_URL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    version: 1,
  };
}
