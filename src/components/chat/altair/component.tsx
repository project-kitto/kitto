'use client';

import { ToolCall } from '@/config/chat/multimodal-live-types';
import { useLiveAPIContext } from '@contexts/LiveAPIContext';
import { type FunctionDeclaration, SchemaType } from '@google/generative-ai';
import { memo, useEffect, useRef, useState } from 'react';

const declaration: FunctionDeclaration = {
  name: 'render_altair',
  description: 'Displays an altair graph in json format.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      json_graph: {
        type: SchemaType.STRING,
        description:
          'JSON STRING representation of the graph to render. Must be a string, not a json object',
      },
    },
    required: ['json_graph'],
  },
};

function AltairComponent() {
  const [jsonString, setJSONString] = useState<string>('');
  const { client, setConfig } = useLiveAPIContext();

  useEffect(() => {
    setConfig({
      model: 'models/gemini-2.0-flash-exp',
      generationConfig: {
        responseModalities: 'audio',
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Aoede' },
          },
        },
      },
      systemInstruction: {
        parts: [
          {
            text: 'You are my helpful assistant. Any time I ask you for a graph call the "render_altair" function I have provided you. Dont ask for additional information just make your best judgement.',
          },
        ],
      },
      tools: [
        // there is a free-tier quota for search
        { googleSearch: {} },
        { functionDeclarations: [declaration] },
      ],
    });
  }, [setConfig]);

  useEffect(() => {
    const onToolCall = (toolCall: ToolCall) => {
      console.log(`got toolcall`, toolCall);
      const fc = toolCall.functionCalls.find(
        (fc) => fc.name === declaration.name
      );
      if (fc) {
        const str = (fc.args as { json_graph: string }).json_graph;
        setJSONString(str);
      }
      // send data for the response of your tool call
      // in this case Im just saying it was successful
      if (toolCall.functionCalls.length) {
        setTimeout(
          () =>
            client.sendToolResponse({
              functionResponses: toolCall.functionCalls.map((fc) => ({
                response: { output: { sucess: true } },
                id: fc.id,
              })),
            }),
          200
        );
      }
    };
    client.on('toolcall', onToolCall);
    return () => {
      client.off('toolcall', onToolCall);
    };
  }, [client]);

  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadVegaEmbed = async () => {
      if (embedRef.current && jsonString) {
        (await import('vega-embed')).default(
          embedRef.current,
          JSON.parse(jsonString)
        );
      }
    };

    loadVegaEmbed();
  }, [embedRef, jsonString]);
  return <div className="vega-embed" ref={embedRef} />;
}

export const Altair = memo(AltairComponent);
