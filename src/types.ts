export type CurrentUserType = {
    __v: number;
    _id: string;
    bio: string;
    category_id: string[];
    createdAt: string;
    email: string;
    fifty_post_badge: BadgeStatus;
    first_name: string;
    first_post_badge: BadgeStatus;
    good_fella_award: AwardStatus;
    hundred_post_badge: BadgeStatus;
    interest_id: string[];
    invite_badge: boolean;
    invite_count: number;
    is_deleted: boolean;
    is_verified: boolean;
    lastActive: string;
    last_name: string;
    message: string;
    most_liked_weekly_post: AwardStatus & { post_ids: string[] };
    post_streak: PostStreak;
    profile: string;
    result?: CurrentUserType; // If result replicates the same structure
    sign_up_type: string;
    social_id: string;
    status: string;
    subcategory_id: string[];
    success: boolean;
    talks_about: string[];
    tenth_post_badge: BadgeStatus;
    thought_leader_badge: AwardStatus & { post_ids: string[] };
    token: string;
    twenty_post_badge: BadgeStatus;
    updatedAt: string;
    user_name: string;
    user_type: string;
  };

  export type CategoryData = {
    _id: string;
    name: string;
  };
  
  export type SocialLinks = {
    instagram: string;
    linkedin: string;
    twitter: string;
  };
  
  export type UserData = {
    _id: string;
    bio: string;
    category_data: CategoryData[];
    category_id: string[];
    email: string;
    endorse: {
      endorseCount: number;
      isEndorseByMe: boolean;
    };
    fifty_post_badge: BadgeStatus;
    first_name: string;
    first_post_badge: BadgeStatus;
    good_fella_award: AwardStatus;
    hundred_post_badge: BadgeStatus;
    interest_data: CategoryData[]; // Assuming interest_data is an array of strings
    invite_badge: boolean;
    invite_count: number;
    is_verified: boolean;
    last_name: string;
    most_liked_weekly_post: AwardStatus & { post_ids: string[] };
    postCount: number;
    post_streak: PostStreak;
    profile: string;
    social_id: string;
    status: string;
    subcategory_data: CategoryData[];
    subcategory_id: string[];
    talks_about: string[];
    tenth_post_badge: BadgeStatus;
    thought_leader_badge: AwardStatus;
    twenty_post_badge: BadgeStatus;
    user_name: string;
    user_type: string;
    social_links: SocialLinks; // Added social_links field
  };
  
  
  export type BadgeStatus = {
    isShown: boolean;
    toShow: boolean;
  };
  
  export type AwardStatus = {
    completed: boolean;
    count: number;
  };
  
  export type PostStreak = {
    streak_2: StreakStatus;
    streak_3: StreakStatus;
    streak_7: StreakStatus;
  };
  
  export type StreakStatus = {
    completed: boolean;
    count: number;
  };

  type VoteData = {
    type: string;
    total_vote: number;
    voted: boolean;
  };
  
  type PostByData = {
    _id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    user_name?: string;
    profile?: string;
    user_type?: string;
  };
  
  type SubcategoryData = {
    _id: string;
    name: string;
  };
  
  export type PostType = {
    _id: string;
    post_by: string;
    title: string;
    description: string;
    images?: string[];
    videos?: string[];
    type: string;
    background_color?: string;
    createdAt: string;
    type_of_post: string;
    post_by_data: PostByData[];
    subcategory_data: SubcategoryData[];
    vote_data: VoteData[];
  };
  
  // If you have a response type that includes the posts array and other data
  export type PostsResponseType = {
    posts: PostType[];
    total_posts: number;
    total_appreciations: number;
    request_helped: number;
    // Add other fields from your response here
  };

  export type Request = {
    _id: string;
    post_by: string;
    title: string;
    description: string;
    images: string[];
    videos: string[];
    type: string;
    background_color: string;
    createdAt: string;
    post_by_data: PostByData[];
    category_data: any[]; // Specify the type if you have the structure
    subcategory_data: SubcategoryData[];
  }


  export type MediaPostType = {
    media_type: string;
    videoUri?: string;
    imageUri?: string;
    title: string;
    description: string;
    category: string;
    sub_category: string;
    request_id?: string;
    backgroundColor?: string;
    type_of_post?: string;
  }

  export type NotificationType = {
    _id: string;
    user_id: string;
    title: string;
    message: string;
    data_message: {
      type: string;
      post_id?: string;
      request_id?: string;
      chat_id?: string;
    };
    is_read: boolean;
    is_deleted: boolean;
    createdAt: string;
    sender: Sender[];
  };

  export type Sender = {
    _id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    profile: string;
  }

  export type ChatRoomType = {
    _id: string;
    createdAt: string;
    created_by:string;
    is_deleted: boolean;
    messages: any[];
    name: string;
    participants: any[]; 
    updatedAt: string; 
};
export type ChatItemType = {
  _id: string;
  createdAt: string;
  createdBy: string;
  isDeleted: boolean;
  lastMessage: {
    _id: string;
    content: string;
    createdAt: string;
    isDeleted: boolean;
    updatedAt: string;
  };
  name: string;
  participants: string[];
  updatedAt: string;
  map: any;
};
  