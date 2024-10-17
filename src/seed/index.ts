import { accessToken } from "../env";
import Models from "../Models";

/**
 * Create admin role
 */
export async function createAdminRole(models: Models) {
	// Create admin role
	const Role = models.Role;
	let adminRole = await Role.findOne({
		where: {
			name: "admin",
		},
	});
	if (!adminRole) {
		adminRole = await Role.create({
			name: "admin",
			description: "Admin role",
		});
	}
}

/**
 * Create user role
 */
export async function createUserRole(models: Models) {
	// Create admin role
	const Role = models.Role;
	const userRole = await Role.findOne({
		where: {
			name: "user",
		},
	});
	if (!userRole) {
		Role.create({
			name: "user",
			description: "User role",
		});
	}
}

/**
 * Create admin user in the database
 *
 * The access token is the password of the user
 * Also create admin role
 */
export async function createAdminUser(models: Models, name: string, description: string) {
	// Get access token
	const token = accessToken();
	if (!token) {
		throw Error("Access token is required");
	}
	
	createAdminRole(models);

	// Create admin user
	const User = models.User;
	const user = {
		name: "Admin",
		email: "admin@perseverancia.com.ar",
		password: token,
		confirmedEmail: true,
	};
	let adminUser = await User.findOne({
		where: {
			email: user.email,
		},
	});
	if (!adminUser) {
		adminUser = await User.create(user);
	}

	// Get admin role
	const Role = models.Role;
	let adminRole = await Role.findOne({
		where: {
			name: "admin",
		},
	});
	if (!adminRole) {
		throw Error("Couldn't fetch admin role");
	}
	
	// Now assign admin role
	if (adminRole && adminUser) {
		await models.UserRoles.create({
			userId: adminUser.id,
			roleName: adminRole.name,
		});
	}
}

/**
 * Create normal user
 */
export async function createNormalUser(models: Models) {
	createUserRole(models);
	
	// Create admin user
	const User = models.User;
	const user = {
		name: "User",
		email: "user@perseverancia.com.ar",
		password: "Abcd123$",
		confirmedEmail: true,
	};
	const userExists = await User.findOne({
		where: {
			email: user.email,
		},
	});
	if (!userExists) {
		User.create(user);
	}
}
