import { APIGatewayProxyEvent } from "aws-lambda";
export const handler = async (event: APIGatewayProxyEvent) => {
  //console.log(JSON.stringify(event, null, 2));

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Cache-Control": `max-age=10`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Hello World!",
    }),
  };
};
