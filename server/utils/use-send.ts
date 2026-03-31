import fs from 'fs';
import path from 'path';
import Mustache from 'mustache';
// import { footer, header, mailCSS } from "../../assets/server/templates/mails/common";
import { User } from '~~/models/auth/user.model';
import { MailerSend, EmailParams, Sender, Recipient, SMSParams } from "mailersend";
import { head, template } from 'lodash';
import { NotFound } from '~/models/core/errors.model';


export enum SendTransports {
  MAIL = 'email',
  SMS = 'sms',
  EXTERNAL = 'template'
}


export enum SendTemplates {
    SIGN_IN = 'auth:sign-in',
    CONFIRM = 'auth:confirm',
    INVITATION = "auth:invite"
}

export interface ISendOption {

}

export interface ISend {
  transport?: SendTransports,
  slug: SendTemplates,
  to: string,
  subject: string,
  data: any,
  options?: ISendOption
}


export default (_transport?: SendTransports) => {
  const config = useRuntimeConfig();
  const defaultTransport = _transport || SendTransports.MAIL;
  const defaultOptions = {};
  const mailerSend = new MailerSend({
    apiKey: config.notifications.mailersend.key,
  });

  const fetchTemplate = async (slug: string) => {
    const stored = await useStorage('templates').getItem(`${slug}`);
    // console.log('[STORED FILES]', stored);
    return stored;
  }

  const send = async ({ transport, slug, to, subject, data, options }: ISend) => {
    transport = transport || defaultTransport;
    options = options || defaultOptions;
    switch (transport) {
      case SendTransports.MAIL:
        return mail(slug, to, subject, data, options);
      case SendTransports.SMS:
        return sms(slug, to, subject, data, options);
      case SendTransports.EXTERNAL:
        return external(slug, to, subject, data, options);
    }
  }

  const notify = async (slug: SendTemplates, to: User, subject: string, data: any) => {
    await send({ slug, transport: to.contact as any, data, subject, to: to.identifier });
  }


  const sms = async (slug: SendTemplates, to: string, subject: string, data: any = {}, options: ISendOption) => {
    const template = await fetchTemplate(`sms:${slug}.mustache`);
    if (!template)
      throw new NotFound(`[SMS] Template for ${slug} missing`);

    const recipients = [
      to
    ];

    const smsParams = new SMSParams()
      .setFrom("+18332647501")
      .setTo(recipients)
      .setText("This is the text content");

    return await mailerSend.sms.send(smsParams);
  }

  const mail = async (slug: SendTemplates, to: string, subject: string, data: any = {}, options: ISendOption) => {
    // get template as string
    const template = await fetchTemplate(`mails:${slug}.mustache`) as string;
    const header = await fetchTemplate('mails:header.mustache') as string;
    const footer = await fetchTemplate('mails:footer.mustache') as string;
    const mailCSS = await fetchTemplate('mails:mail.css') as string;

    const sentFrom = new Sender(config.notifications.mailersend.from.email, config.notifications.mailersend.from.name);

    const recipients = [
      new Recipient(to)
    ];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(Mustache.render(header + template + footer, {
        ...data,
        mailCSS
      }))
    // .setText("This is the text content");
    return await mailerSend.email.send(emailParams);
  }


  const external = async (slug: SendTemplates, to: string, subject: string, data: any = {}, options: ISendOption) => {
    const sentFrom = new Sender(config.notifications.mailersend.from.email, config.notifications.mailersend.from.name);
    const recipients = [
      new Recipient(to)
    ];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setTemplateId(slug);

    await mailerSend.email.send(emailParams);
  }



  return { send, notify }
}