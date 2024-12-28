/**
 * This is for local browser testing only!!!
 * The package.json runs `nodemon` with `--watch` over `ts` files then
 * executes `ts-node` server through this file
 * effectively starting all of your services at once
 */
import "reflect-metadata";
import { container } from "tsyringe";
import * as AuthService from "./service/auth";
import * as AdminService from "./service/admin";
import * as CompanyService from "./service/company";
import * as MessageService from "./service/message";
import * as MeetService from "./service/meet";
//import * as ScheduleService from "./service/schedule";
import * as UserService from "./service/user";
import * as NotificationService from "./service/notification";

const auth: AuthService.Auth = container.resolve(AuthService.Auth);
auth.start();

const admin: AdminService.Admin = container.resolve(AdminService.Admin);
admin.start();

const company: CompanyService.Company = container.resolve(CompanyService.Company);
company.start();

const chat: MessageService.Message = container.resolve(MessageService.Message);
chat.start();

const meet: MeetService.Meet = container.resolve(MeetService.Meet);
meet.start();

/*const schedule: ScheduleService.Schedule = container.resolve(ScheduleService.Schedule);
schedule.start();*/

const user: UserService.User = container.resolve(UserService.User);
user.start();

const notification: NotificationService.Notification = container.resolve(NotificationService.Notification);
notification.start();
