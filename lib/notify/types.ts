export enum NotificationType {
  SignUpInvitation = "SIGN_UP_INVITATION",
  ForgotPassword = "FORGOT_PASSWORD_REQUEST",
}

type BaseNotificationMeta = {
  email: string;
};

type NotificationSpecificMeta = { [type in NotificationType]: unknown } & {
  [NotificationType.SignUpInvitation]: {
    inviteCodeId: string;
  };
  [NotificationType.ForgotPassword]: {
    resetPasswordToken: string;
  };
};

export type NotificationMeta = {
  [type in NotificationType]: BaseNotificationMeta &
    NotificationSpecificMeta[type];
};

export type NotificationResult = {
  ok: boolean;
};

export interface Notifier {
  id: string;
  setup: () => Promise<void>;
  sendNotification: <T extends NotificationType>(
    type: T,
    meta: NotificationMeta[T]
  ) => Promise<NotificationResult>;
}
