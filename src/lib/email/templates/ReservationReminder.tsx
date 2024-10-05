import { ReactElement } from "react";

// Define the props types for each template
export interface OrgInviteTemplateProps {
  name: string;
  inviteLink: string;
}

export function OrgInviteTemplate({
  name,
  inviteLink,
}: OrgInviteTemplateProps): ReactElement {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>
        Click <a href={inviteLink}>here</a> to join our platform.
      </p>
    </div>
  );
}
