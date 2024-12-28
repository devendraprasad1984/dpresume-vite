import {Hasher, UtcDate} from "fnpm/utils";

import {Role} from "ms-npm/auth-models/_/role.enum";
import {TagCategory, TagType} from "ms-npm/base-models";
import {CompanyCategory} from "ms-npm/company-models";
import {MemberRequestType} from "ms-npm/user-models";

import {PrismaClient as MySqlClient} from "../../common/db/client-mysql";
import {RecordStatus} from "../../common/db/enums";

const prisma = new MySqlClient();

/**
 * Method that creates RDS data for testing
 */
async function main() {
    const userTagRef: string = "4223d935-da73-3935-bbb7-2fbb3989cc26";
    const channelInviteRef: string = "59e49082-9d1e-36be-0b41-0ef873ddda04";
    const userInviteRef: string = "808425d2-4652-9367-79b8-5bf2b382f992";
    const userInvitingRef: string = "808425d2-4652-9367-79b8-5bf2b382f996";
    const companyRef: string = "251225d2-4652-9367-79b8-5bf2b382fr56";
    const streamUsers: string[] = [
        "2f4bdba3-58a5-45d8-3714-ebbc4cc45e58",
        "4b8de3be-a832-6cb6-acde-f0c47f23d2a6",
        "0a473312-b7fe-e9f3-461a-a436d548711d"
    ];

    //Insert users for Stream Test
    streamUsers.forEach(async (strUserGuid: string) => {
        await prisma.user.upsert({
            where: {Ref: strUserGuid},
            update: {},
            create: {
                Ref: strUserGuid,
                Role: Role.User,
                Sub: `google-oauth2|${strUserGuid}`,
                LastLogin: UtcDate.now(),
                CreatedBy: strUserGuid,
                CreatedOn: UtcDate.now(),
                Status: RecordStatus.Active
            }
        });
    });

    for (let index = 0; index < 7; index++) {
        const refGuid = Hasher.guid();

        await prisma.user.upsert({
            where: {Ref: refGuid},
            update: {},
            create: {
                Ref: Hasher.guid(),
                Role: Role.User,
                Sub: `google-oauth2|${index}`,
                LastLogin: UtcDate.now(),
                CreatedBy: refGuid,
                CreatedOn: UtcDate.now(),
                Status: RecordStatus.Active
            }
        });
    }

    //User that will be used to add and remove tags
    await prisma.user.upsert({
        where: {Ref: userTagRef},
        update: {},
        create: {
            Ref: userTagRef,
            Role: Role.User,
            Sub: "google-oauth2|18",
            LastLogin: UtcDate.now(),
            CreatedBy: userTagRef,
            CreatedOn: UtcDate.now(),
            Status: RecordStatus.Active
        }
    });

    // User that will be used to create a invitation
    const user = await prisma.user.upsert({
        where: {Ref: userInvitingRef},
        update: {},
        create: {
            Ref: userInvitingRef,
            Role: Role.User,
            Sub: "google-oauth2|19",
            LastLogin: UtcDate.now(),
            CreatedBy: userInvitingRef,
            CreatedOn: UtcDate.now(),
            Status: RecordStatus.Active
        }
    });

    console.log("User insert completed");

    let refGuidProfile = Hasher.guid();
    await prisma.profile.create({
        data: {
            UserId: 1,
            Status: RecordStatus.Active,
            Ethnicity: "Et",
            LookingFor: "Looking",
            YearsExperience: "10",
            FirstName: "Robert",
            LastName: "Patterson",
            Email: "email@contoso.com",
            PhoneNumber: "204-542-8965",
            IsAppMessagingAllowed: true,
            IsPushNotificationAllowed: true,
            CreatedBy: refGuidProfile,
            CreatedOn: UtcDate.now(),
            Ref: refGuidProfile
        }
    });

    refGuidProfile = Hasher.guid();
    await prisma.profile.create({
        data: {
            UserId: user.Id,
            Status: RecordStatus.Active,
            Ethnicity: "Et",
            LookingFor: "Looking",
            YearsExperience: "10",
            FirstName: "Louie",
            LastName: "Patterson",
            Email: "email@contoso.com",
            PhoneNumber: "204-542-8965",
            IsAppMessagingAllowed: true,
            IsPushNotificationAllowed: true,
            CreatedBy: refGuidProfile,
            CreatedOn: UtcDate.now(),
            Ref: refGuidProfile
        }
    });

    refGuidProfile = Hasher.guid();
    await prisma.profile.create({
        data: {
            UserId: 2,
            Status: RecordStatus.Active,
            Ethnicity: "Et",
            LookingFor: "Looking",
            YearsExperience: "10",
            FirstName: "Emma",
            LastName: "Lewis",
            Email: "email@contoso.com",
            PhoneNumber: "204-542-8965",
            IsAppMessagingAllowed: true,
            IsPushNotificationAllowed: true,
            CreatedBy: refGuidProfile,
            CreatedOn: UtcDate.now(),
            Ref: refGuidProfile
        }
    });

    refGuidProfile = Hasher.guid();
    await prisma.profile.create({
        data: {
            UserId: 8,
            Status: RecordStatus.Active,
            Ethnicity: "Et",
            LookingFor: "Looking",
            YearsExperience: "10",
            FirstName: "Matt",
            LastName: "Smith",
            Email: "email@contoso.com",
            PhoneNumber: "204-542-8965",
            IsAppMessagingAllowed: true,
            IsPushNotificationAllowed: true,
            CreatedBy: refGuidProfile,
            CreatedOn: UtcDate.now(),
            Ref: refGuidProfile
        }
    });

    console.log("Profile insert completed");

    await prisma.tag.create({
        data: {
            Status: RecordStatus.Active,
            Category: TagCategory.ICanProvide,
            Text: "Test tag capabilities",
            Type: TagType.MSP,
            CreatedBy: userTagRef,
            CreatedOn: UtcDate.now(),
            Ref: Hasher.guid()
        }
    });

    await prisma.tag.create({
        data: {
            Status: RecordStatus.Active,
            Category: TagCategory.Interest,
            Text: "Test tag interest",
            Type: TagType.MSP,
            CreatedBy: userTagRef,
            CreatedOn: UtcDate.now(),
            Ref: Hasher.guid()
        }
    });

    await prisma.tag.create({
        data: {
            Status: RecordStatus.Active,
            Category: TagCategory.Skills,
            Text: "Test tag skills",
            Type: TagType.MSP,
            CreatedBy: userTagRef,
            CreatedOn: UtcDate.now(),
            Ref: Hasher.guid()
        }
    });

    await prisma.tag.create({
        data: {
            Status: RecordStatus.Active,
            Category: TagCategory.Skills,
            Text: "Test tag skills",
            Type: TagType.User,
            CreatedBy: userTagRef,
            CreatedOn: UtcDate.now(),
            Ref: Hasher.guid()
        }
    });

    console.log("Tag insert completed");

    await prisma.channel.create({
        data: {
            Status: RecordStatus.Active,
            StreamRef: "Invite Test not in stream",
            GroupName: "Invite channel",
            ModeratorRef: userTagRef,
            CreatedBy: userTagRef,
            CreatedOn: UtcDate.now(),
            Ref: channelInviteRef
        }
    });

    //This for meet tests
    await prisma.channel.create({
        data: {
            Status: RecordStatus.Active,
            StreamRef: "TestTwilio",
            GroupName: "Twilio",
            ModeratorRef: userTagRef,
            CreatedBy: userTagRef,
            CreatedOn: UtcDate.now(),
            Ref: Hasher.guid()
        }
    });

    console.log("Channel insert completed");

    await prisma.member.create({
        data: {
            UserId: 1,
            ChannelId: 1,
            Status: RecordStatus.Active,
            CreatedOn: UtcDate.now(),
            CreatedBy: userInviteRef
        }
    });

    await prisma.member.create({
        data: {
            UserId: 2,
            ChannelId: 1,
            Status: RecordStatus.Active,
            CreatedOn: UtcDate.now(),
            CreatedBy: userInviteRef
        }
    });

    console.log("Members insert completed");

    await prisma.company.create({
        data: {
            Ref: companyRef,
            Status: RecordStatus.Active,
            CreatedBy: Hasher.guid(),
            CreatedOn: UtcDate.now(),
            Info: {
                create: {
                    Bio: "Bio test",
                    Category: CompanyCategory.Retail,
                    Established: UtcDate.now().getFullYear(),
                    Name: "Test company",
                    Status: RecordStatus.Active,
                    CreatedBy: Hasher.guid(),
                    CreatedOn: UtcDate.now()
                }
            },
            Personnel: {
                createMany: {
                    data: [
                        {
                            Role: Role.User,
                            UserId: 7,
                            Status: RecordStatus.Active,
                            CreatedBy: Hasher.guid(),
                            CreatedOn: UtcDate.now()
                        },
                        {
                            Role: Role.Admin,
                            UserId: 8,
                            Status: RecordStatus.Active,
                            CreatedBy: Hasher.guid(),
                            CreatedOn: UtcDate.now()
                        },
                        {
                            Role: Role.Recruiter,
                            UserId: 9,
                            Status: RecordStatus.Active,
                            CreatedBy: Hasher.guid(),
                            CreatedOn: UtcDate.now()
                        }
                    ]
                }
            }
        }
    });

    await prisma.company.create({
        data: {
            Ref: Hasher.guid(),
            Status: RecordStatus.Active,
            CreatedBy: Hasher.guid(),
            CreatedOn: UtcDate.now(),
            Info: {
                create: {
                    Bio: "Bio second test",
                    Category: CompanyCategory.Retail,
                    Established: UtcDate.now().getFullYear(),
                    Name: "Second company",
                    Status: RecordStatus.Active,
                    CreatedBy: Hasher.guid(),
                    CreatedOn: UtcDate.now()
                }
            },
            Personnel: {
                createMany: {
                    data: [
                        {
                            Role: Role.User,
                            UserId: 7,
                            Status: RecordStatus.Active,
                            CreatedBy: Hasher.guid(),
                            CreatedOn: UtcDate.now()
                        },
                        {
                            Role: Role.Admin,
                            UserId: 8,
                            Status: RecordStatus.Active,
                            CreatedBy: Hasher.guid(),
                            CreatedOn: UtcDate.now()
                        },
                        {
                            Role: Role.Recruiter,
                            UserId: 9,
                            Status: RecordStatus.Active,
                            CreatedBy: Hasher.guid(),
                            CreatedOn: UtcDate.now()
                        }
                    ]
                }
            },
            Job: {
                create: {
                    Status: RecordStatus.Active,
                    Category: "Technology",
                    CreatedBy: Hasher.guid(),
                    CreatedOn: UtcDate.now(),
                    ModifiedBy: Hasher.guid(),
                    ModifiedOn: UtcDate.now(),
                    Title: "Test Job",
                    Description: "Just for test",
                    Location: "",
                    ApplyCount: 0,
                    Url: "",
                    ViewCount: 0
                }
            }
        }
    });

    console.log("Company insert completed");

    await prisma.groupMember.create({
        data: {
            Status: RecordStatus.Active,
            CreatedBy: userInvitingRef,
            CreatedOn: UtcDate.now(),
            Name: "msp",
            Ref: "34tve3be-a832-6cb6-acde-f0c47f23d385",
            Role: {roles: ["MS Administrator"]},
            CompanyRef: undefined,
            IsDefault: true
        }
    });

    await prisma.groupMember.create({
        data: {
            Status: RecordStatus.Active,
            CreatedBy: userInvitingRef,
            CreatedOn: UtcDate.now(),
            Name: "Test Company",
            Ref: "4cw2380c-971f-aa39-5534-73e52c15po25",
            Role: {roles: ["Company Administrator"]},
            CompanyRef: companyRef,
            IsDefault: true
        }
    });

    console.log("GroupMember insert completed");

    await prisma.memberRequest.create({
        data: {
            Status: RecordStatus.Pending,
            CreatedBy: userInvitingRef,
            CreatedOn: UtcDate.now(),
            Type: MemberRequestType.Channel,
            UserRef: userInviteRef,
            ChannelRef: channelInviteRef,
            Message: "Testing invite 1"
        }
    });

    await prisma.memberRequest.create({
        data: {
            Status: RecordStatus.Pending,
            CreatedBy: Hasher.guid(),
            CreatedOn: UtcDate.now(),
            Type: MemberRequestType.Channel,
            UserRef: userInviteRef,
            ChannelRef: channelInviteRef,
            Message: "Testing invite 2"
        }
    });

    await prisma.memberRequest.create({
        data: {
            Status: RecordStatus.Pending,
            CreatedBy: userInvitingRef,
            CreatedOn: UtcDate.now(),
            Type: MemberRequestType.Channel,
            UserRef: userInviteRef,
            ChannelRef: Hasher.guid(),
            Message: "Testing invite 3"
        }
    });

    await prisma.memberRequest.create({
        data: {
            Status: RecordStatus.Pending,
            CreatedBy: userInvitingRef,
            CreatedOn: UtcDate.now(),
            CompanyRef: companyRef,
            Type: MemberRequestType.Channel,
            UserRef: userInvitingRef,
            Message: "Testing company connection"
        }
    });

    console.log("Member Request insert completed");
}

main()
    .catch((err: Error) => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
