import '../globals.css';
import { ConvexProviderWithAuth, convex } from '@todo/convex-client';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConvexProviderWithAuth client={convex}>
          {children}
        </ConvexProviderWithAuth>
      </body>
    </html>
  );
}