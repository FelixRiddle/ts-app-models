import { Sequelize, DataTypes } from "sequelize";

import mysqlConn from "./connection/mysqlConn";

import User, { createUserModel } from "./model/User";
import Category, { createCategoryModel } from "./model/Category";
import Price, { createPriceModel } from "./model/Price";
import UserMessages, { createUserMessagesModel } from "./model/UserMessages";
import Property, { createPropertyModel } from "./model/Property";
import UserContactMethods, { createUserContactMethods } from "./model/UserContactMethods";
import DebugPropertyImageUpload, { createDebugPropertyImageUpload } from "./model/DebugPropertyImageUpload";
import PropertySellerMessage, { createPropertySellerMessage } from "./model/PropertySellerMessage";
import PropertyComment, { createPropertyComment } from "./model/PropertyComment";
import PropertyRating, { createPropertyRating } from "./model/PropertyRating";
import UserFavoriteProperty, { createUserFavoriteProperty } from "./model/UserFavoriteProperty";
import GeneralPropertyInformation, { createGeneralPropertyInformationModel } from "./model/GeneralPropertyInformation";
import Job, { createJobModel } from "./model/Job";
import Address, { createAddressModel } from "./model/Address";
import Groups, { createGroupsModel } from "./model/Groups";
import Meeti, { createMeetiModel } from "./model/Meeti";
import MeetiParticipants, { createMeetiParticipantsModel } from "./model/MeetiParticipants";
import Comment, { createCommentModel } from "./model/Comment";
import Product, { createProductModel } from "./model/Product";
import Invoice, { createInvoiceModel } from "./model/Invoice";
import InvoiceProductJunction, { createInvoiceProductJunctionModel } from "./model/InvoiceProductJunction";
import Company, { createCompanyModel } from "./model/Company";
import SocialCategory, { createSocialCategoryModel } from "./model/SocialCategory";
import App, { createAppModel } from "./model/App";
import AppOutput, { createAppOutputModel } from "./model/AppOutput";
import AppTag, { createAppTagModel } from "./model/AppTag";
import Process, { createProcessModel } from "./model/Process";
import AppGroup, { createAppGroupModel } from "./model/AppGroup";
import GroupAppJunction, { createGroupAppJunction } from "./model/GroupAppJunction";
import TagAppJunction, { createTagAppJunction } from "./model/TagAppJunction";
import EmployeeRole, { createEmployeeRoleModel } from "./model/EmployeeRole";
import CompanyStaff, { createCompanyStaffModel } from "./model/CompanyStaff";

/**
 * Models
 * 
 * This class is to use the same connection to use models
 * Something that I haven't been doing, because I just didn't know.
 */
export default class Models {
    connection: Sequelize;
    
	// The order that is shown here is the correct order of creation
	// And for destruction the reverse of this order
	
    // Independent tables
    user: typeof User;
	address: typeof Address;
	
	// User tables
    userContactMethods: typeof UserContactMethods;
    
    // App manager tables
    app: typeof App;
    appGroup: typeof AppGroup;
    appOutput: typeof AppOutput;
	process: typeof Process;
    appTag: typeof AppTag;
    tagAppJunction: typeof TagAppJunction;
    groupAppJunction: typeof GroupAppJunction;
    
    // Real estate tables
    category: typeof Category;
    price: typeof Price;
    userMessages: typeof UserMessages;
    property: typeof Property;
    debugPropertyImageUpload: typeof DebugPropertyImageUpload;
    propertySellerMessage: typeof PropertySellerMessage;
    propertyComment: typeof PropertyComment;
    propertyRating: typeof PropertyRating;
    userFavoriteProperty: typeof UserFavoriteProperty;
    generalPropertyInformation: typeof GeneralPropertyInformation;
    
	// Company
	company: typeof Company;
	employeeRole: typeof EmployeeRole;
	companyStaff: typeof CompanyStaff;
	
    // Jobs
    job: typeof Job;
	
	// Meetup tables
	socialCategory: typeof SocialCategory;
	groups: typeof Groups;
	meeti: typeof Meeti;
	meetiParticipants: typeof MeetiParticipants;
	comment: typeof Comment;
	
	// CRM tables
	product: typeof Product;
	invoice: typeof Invoice;
	invoiceProductJunction: typeof InvoiceProductJunction;
	
    /**
     * Constructor
     */
    constructor() {
        this.connection = mysqlConn();
        
        // Independent tables
        this.user = createUserModel(this.connection);
		this.address = createAddressModel(this.connection);
		
		// User tables
        this.userContactMethods = createUserContactMethods(this.connection, this.user);
        
        // App tables
        this.app = createAppModel(this.connection);
        this.appTag = createAppTagModel(this.connection);
        this.appGroup = createAppGroupModel(this.connection);
		this.process = createProcessModel(this.connection);
        
        this.appOutput = createAppOutputModel(this.connection, this.app);
        this.tagAppJunction = createTagAppJunction(
			this.connection,
			this.appTag,
			this.app,
		);
        this.groupAppJunction = createGroupAppJunction(
			this.connection, this.app, this.appGroup
		);
		
        // --- Real estate ---
        this.category = createCategoryModel(this.connection);
        this.price = createPriceModel(this.connection);
        
        // Dependents
        this.userMessages = createUserMessagesModel(this.connection, this.user);
        this.property = createPropertyModel(this.connection, this.user, this.category, this.price);
        
        // Dependents level 2
        this.debugPropertyImageUpload = createDebugPropertyImageUpload(
			this.connection, this.property
		);
        this.propertySellerMessage = createPropertySellerMessage(
			this.connection, this.user, this.property
		);
        this.propertyComment = createPropertyComment(
			this.connection, this.user, this.property
		);
        this.propertyRating = createPropertyRating(
			this.connection, this.user, this.property
		);
        this.userFavoriteProperty = createUserFavoriteProperty(
			this.connection, this.user, this.property
		);
        
        // Dependents level 3
        const generalPropertyInformation = createGeneralPropertyInformationModel(
            this.connection,
            this.property,
            this.propertySellerMessage,
            this.propertyRating,
            this.propertyComment
        );
        this.generalPropertyInformation = generalPropertyInformation;
        
		// Company
		this.company = createCompanyModel(
			this.connection,
			this.address
		);
		this.employeeRole = createEmployeeRoleModel(this.connection);
		this.companyStaff = createCompanyStaffModel(
			this.connection,
			this.user,
			this.employeeRole,
			this.company
		);
		
        // Job(Dev jobs)
        this.job = createJobModel(
            this.connection,
        );
		
		// --- Meetup app(Meeti) ---
		this.socialCategory = createSocialCategoryModel(this.connection);
		
		const groups = createGroupsModel(this.connection, this.socialCategory, this.user);
		this.groups = groups;
		
		const meeti = createMeetiModel(
			this.connection,
			this.user,
			this.groups,
			this.address
		);
		this.meeti = meeti;
		
		const meetiParticipants = createMeetiParticipantsModel(
			this.connection,
			this.meeti,
			this.user
		);
		const comment = createCommentModel(
			this.connection,
			this.user,
			this.meeti
		);
		this.meetiParticipants = meetiParticipants;
		this.comment = comment;
		
		// --- CRM ---
		const product = createProductModel(
			this.connection
		);
		this.product = product;
		
		const invoice = createInvoiceModel(
			this.connection,
			this.user
		);
		this.invoice = invoice;
		
		const invoiceProductJunction = createInvoiceProductJunctionModel(
			this.connection,
			this.invoice,
			this.product
		);
		this.invoiceProductJunction = invoiceProductJunction;
    }
	
    /**
     * Models from high independence to low independence
     */
    models() {
        const modelArray = [
			this.user,
			this.address,
			
			this.userContactMethods,
			
			// App manager
			this.app,
			this.appGroup,
			this.appOutput,
			this.process,
			this.appTag,
			this.tagAppJunction,
			this.groupAppJunction,
			
			// Real estate
			this.category,
			this.price,
			this.userMessages,
			this.property,
			this.debugPropertyImageUpload,
			this.propertySellerMessage,
			this.propertyComment,
			this.propertyRating,
			this.userFavoriteProperty,
			this.generalPropertyInformation,
			
			// Company
			this.company,
			this.employeeRole,
			this.companyStaff,
			
			// Jobs
			this.job,
			
			// Meetup
			this.socialCategory,
			this.groups,
			this.meeti,
			this.meetiParticipants,
			this.comment,
			
			// CRM
			this.product,
			this.invoice,
			this.invoiceProductJunction,
        ];
        
        return modelArray;
    }
}
