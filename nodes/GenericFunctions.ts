import type {
  IDataObject,
  IExecuteFunctions,
  IExecuteSingleFunctions,
  IHttpRequestOptions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IN8nHttpFullResponse,
  INodeExecutionData,
  IPollFunctions,
  IHttpRequestMethods,
  IWebhookFunctions,
} from 'n8n-workflow';

import { ApplicationError, NodeApiError } from 'n8n-workflow';

const VALID_EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const VALID_PHONE_REGEX =
  /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/;

export function isEmailValid(email: string): boolean {
  return VALID_EMAIL_REGEX.test(String(email).toLowerCase());
}

export function isPhoneValid(phone: string): boolean {
  return VALID_PHONE_REGEX.test(String(phone));
}

type BlaqListRequestBody = {
  card_expiration_month?: string;
  card_expiration_year?: string;
  card_prefix: string;
  card_suffix: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export async function validateRequest(
  this: IExecuteSingleFunctions,
  requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
  this.logger.info(`BODY: ${requestOptions.body}`)

  const body = (requestOptions.body ?? {}) as BlaqListRequestBody;

  if (body.email && !isEmailValid(body.email)) {
    const message = `email "${body.email}" has invalid format`;
    throw new NodeApiError(this.getNode(), {}, { message, description: message });
  }

  return requestOptions;
}

export const parseResponse = async function (
  this: IExecuteSingleFunctions,
  items: INodeExecutionData[],
  response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
  const score: IDataObject = (response.body as IDataObject).score as IDataObject;

  if (!response || !response.body) {
    throw new ApplicationError('Response is invalid');
  }

  // const requestBody = { body: "example" };
  // await blaqApiRequest.call(this, 'POST', `/scores/${id}/example`, requestBody, {});

  return items;
};

export async function highLevelApiRequest(
  this:
    | IExecuteFunctions
    | IExecuteSingleFunctions
    | IWebhookFunctions
    | IPollFunctions
    | IHookFunctions
    | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  resource: string,
  body: IDataObject = {},
  qs: IDataObject = {},
  url?: string,
  option: IDataObject = {},
) {
  const apiUrl: string = 'https://api.blaqreports.com/integration';
  let options: IHttpRequestOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    method,
    body,
    qs,
    url: url ?? [apiUrl, resource].join("/"),
    json: true,
  };
  if (!Object.keys(body).length) {
    delete options.body;
  }
  if (!Object.keys(qs).length) {
    delete options.qs;
  }
  options = Object.assign({}, options, option);
  return await this.helpers.httpRequestWithAuthentication.call(this, 'blaqListApi', options);
}


export async function addCustomFieldsPreSendAction(
  this: IExecuteSingleFunctions,
  requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
  const requestBody = requestOptions.body as IDataObject;

  /*
  if (requestBody && requestBody.customFields) {
    const rawCustomFields = requestBody.customFields as IDataObject;

    // Define the structure of fieldId
    interface FieldIdType {
      value: unknown;
      cachedResultName?: string;
    }

    // Ensure rawCustomFields.values is an array of objects with fieldId and fieldValue
    if (rawCustomFields && Array.isArray(rawCustomFields.values)) {
      const formattedCustomFields = rawCustomFields.values.map((field: unknown) => {
        // Assert that field is of the expected shape
        const typedField = field as { fieldId: FieldIdType; fieldValue: unknown };

        const fieldId = typedField.fieldId;

        if (typeof fieldId === 'object' && fieldId !== null && 'value' in fieldId) {
          return {
            id: fieldId.value,
            key: fieldId.cachedResultName ?? 'default_key',
            field_value: typedField.fieldValue,
          };
        } else {
          throw new ApplicationError('Error processing custom fields.');
        }
      });
      requestBody.customFields = formattedCustomFields;
    }
  }
  */

  return requestOptions;
}
