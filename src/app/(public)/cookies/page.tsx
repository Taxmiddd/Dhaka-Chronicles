import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Learn how Dhaka Chronicles uses cookies and similar technologies on our website.',
}

export default function CookiePolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold font-playfair mb-2">Cookie Policy</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: May 1, 2026</p>

      <section className="prose prose-lg dark:prose-invert max-w-none space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-3">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files placed on your device by websites you visit. They are widely used
            to make websites work efficiently and to provide information to website operators.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Cookies</h2>
          <p>Dhaka Chronicles uses cookies for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>
              <strong>Essential cookies:</strong> Required for the website to function properly (authentication
              sessions, security tokens, language preferences).
            </li>
            <li>
              <strong>Analytics cookies:</strong> Help us understand how visitors interact with our website
              (Google Analytics 4, Hotjar). All data is anonymized.
            </li>
            <li>
              <strong>Preference cookies:</strong> Remember your settings such as dark/light mode and
              newsletter preferences.
            </li>
            <li>
              <strong>Push notification cookies:</strong> OneSignal sets cookies to manage your push
              notification subscription status.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">3. Third-Party Cookies</h2>
          <p>
            Some pages may contain content from third parties (YouTube videos, social media embeds) that
            set their own cookies. We do not control these cookies. Please refer to the respective
            privacy policies of those services.
          </p>
          <table className="w-full text-sm mt-4 border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Service</th>
                <th className="text-left py-2 pr-4">Purpose</th>
                <th className="text-left py-2">Privacy Policy</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-2 pr-4">Google Analytics 4</td>
                <td className="py-2 pr-4">Analytics</td>
                <td className="py-2"><a href="https://policies.google.com/privacy" className="underline text-[#00A651]">Google</a></td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Hotjar</td>
                <td className="py-2 pr-4">Heatmaps</td>
                <td className="py-2"><a href="https://www.hotjar.com/legal/policies/privacy/" className="underline text-[#00A651]">Hotjar</a></td>
              </tr>
              <tr>
                <td className="py-2 pr-4">OneSignal</td>
                <td className="py-2 pr-4">Push notifications</td>
                <td className="py-2"><a href="https://onesignal.com/privacy_policy" className="underline text-[#00A651]">OneSignal</a></td>
              </tr>
              <tr>
                <td className="py-2 pr-4">YouTube</td>
                <td className="py-2 pr-4">Video embeds</td>
                <td className="py-2"><a href="https://policies.google.com/privacy" className="underline text-[#00A651]">Google</a></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">4. Your Cookie Choices</h2>
          <p>
            You can control cookies through your browser settings. Most browsers allow you to refuse or
            delete cookies. However, disabling essential cookies may affect the website&apos;s functionality.
          </p>
          <p className="mt-3">
            For analytics cookies specifically, you can opt out of Google Analytics tracking by installing
            the{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" className="underline text-[#00A651]">
              Google Analytics Opt-out Browser Add-on
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">5. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. Any changes will be posted on this page
            with an updated revision date.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">6. Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please contact us at{' '}
            <a href="mailto:privacy@dhakachronicles.com" className="underline text-[#00A651]">
              privacy@dhakachronicles.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
