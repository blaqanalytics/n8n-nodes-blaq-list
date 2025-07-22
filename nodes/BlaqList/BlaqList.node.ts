import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodePropertyTypes,
} from 'n8n-workflow';

export class BlaqList implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BlaqList',
		name: 'blaqList',
		icon: 'file:blaqlist.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume BlaqList API',
		defaults: {
			name: 'BlaqList',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'blaqListApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.blaqlist.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'List',
						value: 'list',
					},
					{
						name: 'Entry',
						value: 'entry',
					},
				],
				default: 'list',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['list'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all lists',
						action: 'Get all lists',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a list',
						action: 'Get a list',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a list',
						action: 'Create a list',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a list',
						action: 'Update a list',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a list',
						action: 'Delete a list',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['entry'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all entries',
						action: 'Get all entries',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an entry',
						action: 'Get an entry',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create an entry',
						action: 'Create an entry',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an entry',
						action: 'Update an entry',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an entry',
						action: 'Delete an entry',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'List ID',
				name: 'listId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['list'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the list',
			},
			{
				displayName: 'Entry ID',
				name: 'entryId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['entry'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the entry',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['list'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				required: true,
				description: 'The name of the list',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['list'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'The description of the list',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['entry'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				required: true,
				description: 'The value of the entry',
			},
			{
				displayName: 'List ID',
				name: 'listId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['entry'],
						operation: ['getAll', 'create'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the list',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'list') {
					if (operation === 'getAll') {
						const responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'blaqListApi',
							{
								method: 'GET',
								url: '/lists',
							},
						);
						returnData.push({ json: responseData });
					}

					if (operation === 'get') {
						const listId = this.getNodeParameter('listId', i) as string;
						const responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'blaqListApi',
							{
								method: 'GET',
								url: `/lists/${listId}`,
							},
						);
						returnData.push({ json: responseData });
					}

					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i) as string;

						const body: any = {
							name,
						};

						if (description) {
							body.description = description;
						}

						const responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'blaqListApi',
							{
								method: 'POST',
								url: '/lists',
								body,
							},
						);
						returnData.push({ json: responseData });
					}

					if (operation === 'update') {
						const listId = this.getNodeParameter('listId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const description = this.getNodeParameter('description', i) as string;

						const body: any = {
							name,
						};

						if (description) {
							body.description = description;
						}

						const responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'blaqListApi',
							{
								method: 'PUT',
								url: `/lists/${listId}`,
								body,
							},
						);
						returnData.push({ json: responseData });
					}

					if (operation === 'delete') {
						const listId = this.getNodeParameter('listId', i) as string;
						const responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'blaqListApi',
							{
								method: 'DELETE',
								url: `/lists/${listId}`,
							},
						);
						returnData.push({ json: responseData });
					}
				}

				if (resource === 'entry') {
					if (operation === 'getAll') {
						const listId = this.getNodeParameter('listId', i) as string;
						const responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'blaqListApi',
							{
								method: 'GET',
								url: `/lists/${listId}/entries`,
							},
						);
						returnData.push({ json: responseData });
					}

					if (operation === 'get') {
						const entryId = this.getNodeParameter('entryId', i) as string;
						const responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'blaqListApi',
							{
								method: 'GET',
								url: `/entries/${entryId}`,
							},
						);
						returnData.push({ json: responseData });
					}

					if (operation === 'create') {
						const listId = this.getNodeParameter('listId', i) as string;
						const value = this.getNodeParameter('value', i) as string;

						const body = {
							value,
						};

						const responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'blaqListApi',
							{
								method: 'POST',
								url: `/lists/${listId}/entries`,
								body,
							},
						);
						returnData.push({ json: responseData });
					}

					if (operation === 'update') {
						const entryId = this.getNodeParameter('entryId', i) as string;
						const value = this.getNodeParameter('value', i) as string;

						const body = {
							value,
						};

						const responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'blaqListApi',
							{
								method: 'PUT',
								url: `/entries/${entryId}`,
								body,
							},
						);
						returnData.push({ json: responseData });
					}

					if (operation === 'delete') {
						const entryId = this.getNodeParameter('entryId', i) as string;
						const responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'blaqListApi',
							{
								method: 'DELETE',
								url: `/entries/${entryId}`,
							},
						);
						returnData.push({ json: responseData });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}