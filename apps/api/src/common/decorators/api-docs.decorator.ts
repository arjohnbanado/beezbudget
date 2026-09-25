import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { z } from 'zod';

const problemDetailsSchema = {
  type: 'object',
  required: [
    'type',
    'title',
    'status',
    'detail',
    'instance',
    'code',
    'timestamp',
  ],
  properties: {
    type: { type: 'string' },
    title: { type: 'string' },
    status: { type: 'integer' },
    detail: { type: 'string' },
    instance: { type: 'string' },
    code: { type: 'string' },
    timestamp: { type: 'string', format: 'date-time' },
  },
  additionalProperties: true,
};

const problemDetailsContent = {
  'application/problem+json': { schema: problemDetailsSchema },
};

type ProblemStatus = 400 | 401 | 409 | 500;

const problemDescriptions: Record<ProblemStatus, string> = {
  400: 'The request failed validation.',
  401: 'The credentials or token are invalid or expired.',
  409: 'The request conflicts with existing data.',
  500: 'An unexpected server error occurred.',
};

interface ApiZodResponseOptions {
  status: number;
  description?: string;
}

const dateSchemaMessage = 'Date cannot be represented in JSON Schema';

function toOpenApiSchema(schema: z.ZodType) {
  const { $schema: _schema, ...openApiSchema } = z.toJSONSchema(schema, {
    target: 'openapi-3.0',
    unrepresentable: ({ message }) => {
      if (message === dateSchemaMessage) {
        return { type: 'string', format: 'date-time' };
      }

      return 'throw';
    },
  });

  return openApiSchema;
}

export function ApiZodResponse(
  schema: z.ZodType,
  { status, description }: ApiZodResponseOptions,
) {
  return ApiResponse({
    status,
    description,
    schema: toOpenApiSchema(schema),
  } as Parameters<typeof ApiResponse>[0]);
}

export function ApiZodBody(schema: z.ZodType) {
  return ApiBody({
    required: true,
    schema: toOpenApiSchema(schema),
  } as Parameters<typeof ApiBody>[0]);
}

export function ApiProblemResponses(...statuses: ProblemStatus[]) {
  return applyDecorators(
    ...statuses.map((status) =>
      ApiResponse({
        status,
        description: problemDescriptions[status],
        content: problemDetailsContent,
      }),
    ),
  );
}
