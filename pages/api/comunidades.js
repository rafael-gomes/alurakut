import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequest(request, response) {
  if (request.method === 'POST') {
    const TOKEN = process.env.DATO_CMS_TOKEN;
    const client = new SiteClient(TOKEN);

    const registroCriado = await client.items.create({
      itemType: '976575',
      ...request.body,
    });

    response.json({
      dados: 'Algum dado',
      registroCriado,
    });

    return;
  }

  response.status(404).json({
    message: 'Ainda não temos nada no GET, mas no POST tem',
  });
}
