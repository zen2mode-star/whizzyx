import { NextResponse } from 'next/server';
import net from 'net';

// Cache TCP socket clients per IP address
let clients: { [ip: string]: net.Socket } = {};

export async function POST(request: Request) {
  try {
    const { ip, action } = await request.json(); // action: 'BEEP_ON' | 'BEEP_OFF' | 'CONNECT' | 'DISCONNECT'
    
    if (!ip) {
      return NextResponse.json({ error: 'IP address is required' }, { status: 400 });
    }

    if (action === 'CONNECT') {
      if (clients[ip]) {
        try {
          clients[ip].destroy();
        } catch (e) {}
        delete clients[ip];
      }

      return new Promise<NextResponse>((resolve) => {
        const client = new net.Socket();
        
        // Timeout after 4 seconds
        client.setTimeout(4000);
        
        client.connect(8888, ip, () => {
          clients[ip] = client;
          resolve(NextResponse.json({ status: 'Connected' }));
        });

        client.on('error', (err) => {
          delete clients[ip];
          resolve(NextResponse.json({ error: `Connection failed: ${err.message}` }, { status: 500 }));
        });

        client.on('timeout', () => {
          client.destroy();
          delete clients[ip];
          resolve(NextResponse.json({ error: 'Connection timed out' }, { status: 504 }));
        });
      });
    }

    if (action === 'DISCONNECT') {
      if (clients[ip]) {
        try {
          clients[ip].destroy();
        } catch (e) {}
        delete clients[ip];
      }
      return NextResponse.json({ status: 'Disconnected' });
    }

    // Handle Beep actions
    const client = clients[ip];
    if (!client) {
      // Auto-connect if not cached
      return new Promise<NextResponse>((resolve) => {
        const newClient = new net.Socket();
        newClient.setTimeout(3000);
        
        newClient.connect(8888, ip, () => {
          clients[ip] = newClient;
          newClient.write(action + '\n');
          resolve(NextResponse.json({ status: 'Sent' }));
        });

        newClient.on('error', (err) => {
          resolve(NextResponse.json({ error: `Not connected. Auto-connect failed: ${err.message}` }, { status: 500 }));
        });
      });
    }

    client.write(action + '\n');
    return NextResponse.json({ status: 'Sent' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
