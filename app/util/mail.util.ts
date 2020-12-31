/**
 * @description holds mail util
 */

import { User } from '../interface/user.interface';
import { BuilderUtil } from './builder.util';
import { DebugLogUtil } from './debug-log.util';
import nodemailer from 'nodemailer';

export class MailUtil {
  private readonly config: any;
  private readonly templates: any;

  constructor(
    private debugLogUtil = new DebugLogUtil(),
    private builder = new BuilderUtil()
  ) {
    this.templates = {
      verifyAccount:
        './assets/mail-templates/verify-account-mail-template.html',
      forgetPassword:
        './assets/mail-templates/forget-password-mail-template.html',
    };
    this.config = {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: (process.env.MAIL_PORT as string) === '465' ? true : false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    };
  }

  /**
   * sends account verification mail
   * @param user user
   * @param token token
   */
  sendAccountVerificationMail = async (user: User, token: string) => {
    let url =
      (((process.env.CLIENT_URL as string) +
        process.env.CLIENT_VERIFICATION_SUCCESS_URL) as string) +
      '?token=' +
      token;

    await this.send(
      url,
      user,
      'Account verification',
      this.templates.verifyAccount
    );
  };

  /**
   * sends password reset mail
   * @param user user
   * @param token token
   */
  sendPasswordResetMail = async (user: User, token: string) => {
    let url =
      (((process.env.CLIENT_URL as string) +
        process.env.CLIENT_RESET_PASSWORD_URL) as string) +
      '?token=' +
      token +
      '&username=' +
      user.username;
    await this.send(
      url,
      user,
      'Forget password',
      this.templates.forgetPassword
    );
  };

  /**
   * sends mail
   * @param url url
   * @param user user
   * @param subject mail subject
   * @param template mail template
   */
  send = async (url: string, user: User, subject: string, template: string) => {
    if (process.env.MAIL_SERVER_DISABLED) {
      this.debugLogUtil.log(
        'Mail server is disabled. Some functionalities may not work properly.'
      );
      return;
    }

    let transporter = nodemailer.createTransport(this.config);

    let params = new Map<string, string>();
    params.set('${url}', url);
    params.set('${username}', user.username);

    let mailBody = this.builder.buildTemplateFromFile(template, params);

    await transporter.sendMail({
      from: process.env.MAIL_USERNAME,
      to: user.email,
      subject: subject,
      html: mailBody,
    });
  };
}
