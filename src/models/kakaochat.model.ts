export interface KakaoChatReqModel {
    intent?: BlockOrIntentOrBot;
    userRequest: UserRequest;
    contexts?: (null)[] | null;
    bot?: any;
    action?: Action;
}
export interface BlockOrIntentOrBot {
    id: string;
    name: string;
    extra?: any;
}
export interface UserRequest {
    timezone: string;
    params?: any;
    block?: BlockOrIntentOrBot;
    utterance: string;
    lang?: string | null;
    user: User;
}
// export interface Params {
//     exampleParam: string;
// }
export interface User {
    id: string;
    type: string;
    properties?: any;
}
export interface Properties {
    appUserId?: string;
    appUserStatus?: string;
    plusfriend_user_key?: string;
}
export interface Action {
    name: string | null;
    clientExtra?: any;
    params?: any;
    id: string | null;
    detailParams?: any;
}
export interface ParamsOrDetailParams {
}

// ------------------------------------------------------------
// Response models
// ------------------------------------------------------------

export interface KakaoChatResModel {
    version: string;
    template: Template;
}
export interface Template {
    outputs?: (SimpleTextOutputsEntity | SimpleImageOutputsEntity | BasicCardOutputsEntity | CommerceCardOutputsEntity | ItemCardOutputsEntity | CarouselOutputsEntity)[];
    quickReplies?: QuickReplyModel[];
}


// ------------------------------------------------------------
// Quick reply models
// ------------------------------------------------------------
export interface QuickReplyModel {
    messageText: string;
    action: string;
    label: string;
    blockId?: string;
    extra?: any;
    webLinkUrl?: string;
}

// ------------------------------------------------------------
// Common Entities
// ------------------------------------------------------------
export interface ButtonsEntity {
    action: string;
    label: string;
    messageText?: string | null;
    webLinkUrl?: string | null;
}
export interface Link {
    web: string;
}
export interface Thumbnail {
    imageUrl: string;
    width?: number;
    height?: number;
}
export interface Profile {
    imageUrl: string;
    nickname: string;
}
export interface ItemsEntity {
    title: string;
    description: string;
    imageUrl?: string;
    link?: Link;
    thumbnail?: Thumbnail;
    buttons?: (ButtonsEntity)[] | null;
}

// ------------------------------------------------------------
// Simple text
// ------------------------------------------------------------

export interface SimpleTextOutputsEntity {
    simpleText: SimpleText;
}
export interface SimpleText {
    text: string;
}

// ------------------------------------------------------------
// Simple image
// ------------------------------------------------------------

export interface SimpleImageOutputsEntity {
    simpleImage: SimpleImage;
}
export interface SimpleImage {
    imageUrl: string;
    altText: string;
    forwardable?: boolean;
}

// ------------------------------------------------------------
// Basic card
// ------------------------------------------------------------

export interface BasicCardOutputsEntity {
    basicCard: BasicCard;
}
export interface BasicCard {
    title: string;
    description: string;
    thumbnail: Thumbnail;
    profile: Profile;
    social: Social;
    buttons?: (ButtonsEntity)[] | null;
    forwardable?: boolean;
}
export interface Social {
    like: number;
    comment: number;
    share: number;
}

// ------------------------------------------------------------
// Commerce card
// ------------------------------------------------------------
export interface CommerceCardOutputsEntity {
    commerceCard: CommerceCard;
}
export interface CommerceCard {
    description: string;
    price: number;
    discount: number;
    currency: string;
    thumbnails?: (ThumbnailsEntity)[] | null;
    profile: Profile;
    buttons?: (ButtonsEntity)[] | null;
    forwardable?: boolean;
}
export interface ThumbnailsEntity {
    imageUrl: string;
    link: Link;
}

// ------------------------------------------------------------
// List card
// ------------------------------------------------------------
export interface ListCardOutputsEntity {
    listCard: ListCard;
}
export interface ListCard {
    header: Header;
    items?: (ItemsEntity)[] | null;
    buttons?: (ButtonsEntity)[] | null;
    forwardable?: boolean;
}
export interface Header {
    title: string;
}

// ------------------------------------------------------------
// Item card
// ------------------------------------------------------------

export interface ItemCardOutputsEntity {
    itemCard: ItemCard;
}
export interface ItemCard {
    imageTitle: ItemListEntityOrImageTitleOrItemListSummary;
    title: string;
    description: string;
    thumbnail: Thumbnail;
    profile: Profile;
    itemList?: (ItemListEntityOrImageTitleOrItemListSummary)[] | null;
    itemListAlignment: string;
    itemListSummary: ItemListEntityOrImageTitleOrItemListSummary;
    buttons?: (ButtonsEntity)[] | null;
    buttonLayout: string;
    forwardable?: boolean;
}
export interface ItemListEntityOrImageTitleOrItemListSummary {
    title: string;
    description: string;
}

// ------------------------------------------------------------
// Carousel
// ------------------------------------------------------------

export interface CarouselOutputsEntity {
    carousel: Carousel;
}
export interface Carousel {
    type: string;
    items?: (ItemsEntity)[] | null;
    forwardable?: boolean;
}
