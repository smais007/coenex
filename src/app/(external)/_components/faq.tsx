import { BadgeDollarSign, Route, ShieldCheck, Truck, Undo2, UserRoundCheck } from "lucide-react";

const faq = [
  {
    icon: Undo2,
    question: "What is your return policy?",
    answer:
      "You can return unused items in their original packaging within 30 days for a refund or exchange. Contact support for assistance.",
  },
  {
    icon: Route,
    question: "How do I track my order?",
    answer:
      "Track your order using the link provided in your confirmation email, or log into your account to view tracking details.",
  },
  {
    icon: Truck,
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship worldwide. Shipping fees and delivery times vary by location, and customs duties may apply for some countries.",
  },
  {
    icon: BadgeDollarSign,
    question: "What payment methods do you accept?",
    answer:
      "We accept Visa, MasterCard, American Express, PayPal, Apple Pay, and Google Pay, ensuring secure payment options for all customers.",
  },
  {
    icon: ShieldCheck,
    question: "What if I receive a damaged item?",
    answer:
      "Please contact our support team within 48 hours of delivery with photos of the damaged item. We’ll arrange a replacement or refund.",
  },
  {
    icon: UserRoundCheck,
    question: "How can I contact customer support?",
    answer:
      "Reach out via email at support@example.com or call us at 1-800-123-4567 for assistance with any inquiries.",
  },
];

const FAQ = () => {
  return (
    <div id="faq" className="xs:py-20 flex min-h-screen items-center justify-center px-6 py-12">
      <div className="max-w-screen-lg">
        <h2 className="xs:text-4xl text-center text-3xl !leading-[1.15] font-bold tracking-tight md:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="xs:text-lg text-muted-foreground mt-3 text-center">
          Quick answers to common questions about our products and services.
        </p>

        <div className="bg-background outline-border mt-12 grid overflow-hidden rounded-xl outline-[1px]! outline-offset-[-1px] md:grid-cols-2">
          {faq.map(({ question, answer, icon: Icon }) => (
            <div key={question} className="-mt-px -ml-px border p-6">
              <div className="xs:h-10 xs:w-10 bg-accent flex h-8 w-8 items-center justify-center rounded-full">
                <Icon className="xs:h-6 xs:w-6 h-4 w-4" />
              </div>
              <div className="xs:text-[1.35rem] mt-3 mb-2 flex items-start gap-2 text-lg font-semibold tracking-tight">
                <span>{question}</span>
              </div>
              <p className="xs:text-base text-sm">{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
