import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  http.get('/api/automations', async () => {
    await delay(400); // Simulate network latency
    return HttpResponse.json([
      { id: "send_email", label: "Send Email", params: ["to", "subject"] },
      { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] },
      { id: "notify_slack", label: "Slack Notification", params: ["channel", "message"] },
      { id: "update_record", label: "Update HR Record", params: ["employeeId", "status"] }
    ]);
  }),

  http.post('/api/simulate', async ({ request }) => {
    const graph: any = await request.json();
    await delay(600); // Simulate backend processing
    
    // Create a mock topological execution log
    // In a real scenario, the backend verifies the graph and generates true steps.
    const steps = graph.nodes.map((n: any, index: number) => ({
      nodeId: n.id,
      action: index === 0 ? 'STARTED' : index === graph.nodes.length - 1 ? 'COMPLETED' : 'EXECUTED',
      timestamp: Date.now() + (index * 800)
    }));

    return HttpResponse.json({
      status: "success",
      steps
    });
  })
];
