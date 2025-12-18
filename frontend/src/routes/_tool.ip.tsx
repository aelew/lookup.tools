import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_tool/ip')({
  component: RouteComponent
});

function RouteComponent() {
  return <div>Hello "/_tool/ip"!</div>;
}
