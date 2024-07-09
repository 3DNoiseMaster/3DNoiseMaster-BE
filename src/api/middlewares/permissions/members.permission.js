// External module imports
const AccessControl = require('accesscontrol');

// Internal module imports
const { allRoles } = require('../../../config/roles');
const { mappedPermissions, common } = require('../../utils');
const { memberService } = require('../../services');
const grantAccess = require('./grantAccess');

const { asyncHandler } = common;

// init access-control
const roleRights = new AccessControl();

/**
 * Define Resources
 */
const resourceTypes = {
  MEMBER: {
    alias: 'members',
    attributes: ['*'],
  },
};

/**
 * Define roles and grants one by one
 */

// member role permissions
roleRights
  .grant(allRoles.MEMBER.alias)
  .readOwn(resourceTypes.MEMBER.alias)
  .updateOwn(resourceTypes.MEMBER.alias)
  .deleteOwn(resourceTypes.MEMBER.alias);

// admin role inherits both member and editor role permissions
roleRights
  .grant([allRoles.ADMIN.alias, allRoles.EDITOR.alias])
  .extend(allRoles.MEMBER.alias)
  .createAny(resourceTypes.MEMBER.alias)
  .readAny(resourceTypes.MEMBER.alias)
  .updateAny(resourceTypes.MEMBER.alias)
  .deleteAny(resourceTypes.MEMBER.alias);

/**
 * Define action rules for the permission
 */

const grantRules = function (actionAny, actionOwn) {
  return asyncHandler(async (req, res, next) => {
    let { member } = req;
    let hasPermission;
    let hasRoleAccess = false;

    // if there is no parameters named memberId
    if (!req.params.memberId) {
      hasPermission = roleRights
        .can(req.member.role)
        [actionAny](resourceTypes.MEMBER.alias);
      hasRoleAccess = !!hasPermission.granted;
    }

    // if loggedIn member access himself
    if (req.params.memberId && req.member.id === req.params.memberId) {
      hasPermission = roleRights
        .can(req.member.role)
        [actionOwn](resourceTypes.MEMBER.alias);
      hasRoleAccess = !!hasPermission.granted;
    }

    // if loggedIn member access others
    if (req.params.memberId && req.member.id !== req.params.memberId) {
      hasPermission = roleRights
        .can(req.member.role)
        [actionAny](resourceTypes.MEMBER.alias);
      if (hasPermission.granted) {
        member = await memberService.getMemberById(req.params.memberId);
        hasRoleAccess =
          allRoles[req.member.role].level > allRoles[member.role].level ||
          allRoles[req.member.role].level === allRoles.ADMIN.level;
      }
    }

    // if loggedIn member updating role
    if (req.params.memberId && hasRoleAccess && req.body.role) {
      hasRoleAccess =
        allRoles[req.member.role].level > allRoles[req.body.role].level ||
        allRoles[req.member.role].level === allRoles.ADMIN.level;
    }

    // check whether loggedIn member is allowed to access
    if (hasRoleAccess) {
      req.member = member;
      req.permission = mappedPermissions(
        true,
        resourceTypes.MEMBER.alias,
        hasPermission.attributes
      );
    }
    next();
  });
};

const grantMembersCreateRules = asyncHandler(async (req, res, next) => {
  const hasPermission = roleRights
    .can(req.member.role)
    .createAny(resourceTypes.MEMBER.alias);

  const hasRoleAccess =
    allRoles[req.member.role].level > allRoles[req.body?.role]?.level ||
    allRoles[req.member.role].level === allRoles.ADMIN.level;

  // check whether loggedIn member is allowed to access
  if (hasPermission.granted && hasRoleAccess) {
    req.permission = mappedPermissions(
      true,
      resourceTypes.MEMBER.alias,
      hasPermission.attributes
    );
  }
  next();
});

// chain middleware
const authorizeMembersCreatePermission = [grantMembersCreateRules, grantAccess];

const authorizeMembersReadPermission = [
  grantRules('readAny', 'readOwn'),
  grantAccess,
];
const authorizeMembersUpdatePermission = [
  grantRules('updateAny', 'updateOwn'),
  grantAccess,
];
const authorizeMembersDeletePermission = [
  grantRules('deleteAny', 'deleteOwn'),
  grantAccess,
];

// Module exports
module.exports = {
  authorizeMembersCreatePermission,
  authorizeMembersReadPermission,
  authorizeMembersUpdatePermission,
  authorizeMembersDeletePermission,
};
