import { p } from "framer-motion/client";
import {
  HouseHeart,
  User2,
  ImagePlus,
  Building2,
  PlusCircle,
  Home,
  UserRound,
  ListCheck,
  TowerControl,
  TowelRack,
  WebhookIcon,
  LucideTowerControl,
  PackageCheck,
  PackageX,
  Clipboard,
  Blocks,
  LucideBlocks,
  ReceiptCent,
  ScalingIcon,
  Coins,
} from "lucide-react";

// export const menuSections = [
//   {
//     title: "MAIN",
//     items: [
//       {
//         id: "home",
//         title: "Dashboard",
//         icon: HouseHeart,
//         path: "/admin/dashboard",
//       },
//       {
//         id: "dealers",
//         title: "Dealers",
//         icon: User2,
//         path: "/admin/dealers",
//         badge: "New",
//       },
//       {
//         id: "banner",
//         title: "Add Banner",
//         icon: ImagePlus,
//         path: "/admin/add-banner",
//       },
//       {
//         id: "properties",
//         title: "Properties",
//         icon: Building2,
//         path: "/admin/properties",
//       },

//     ],
//   },

//   {
//     title: "MANAGEMENT",
//     items: [
//       {
//         id: "post-properties",
//         title: "Post Properties",
//         icon: Home,
//         path: "/admin/post-properties",
//       },
//       {
//         id: "fixed-properties",
//         title: "Fixed Properties",
//         icon: Building2,
//         path: "/admin/properties",
//       },
//       {
//         id: "add-user",
//         title: "Add User",
//         icon: UserRound,
//         path: "/admin/add-user",
//       },
//       {
//         id: "add-dealer",
//         title: "Add Dealer",
//         icon: User2,
//         path: "/admin/add-dealer",
//       },
//     ],
//   },
//   {
//     title: "CMS",
//     items: [
//       {
//         id: "blogs",
//         title: "Blogs",
//         icon: Home,
//         path: "/admin/post-properties",
//       },
//       {
//         id: "pages",
//         title: "Pages",
//         icon: Building2,
//         path: "/admin/properties",
//       },

//     ],
//   },
// ];
export const menuSections = [
  {
    title: "MAIN",
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        icon: HouseHeart,
        path: "/admin/dashboard",
      },
      {
        id: "properties",
        title: "Properties",
        icon: Building2,
        children: [
          {
            id: "all-properties",
            title: "All Properties",
            path: "/admin/properties",
          },
          {
            id: "post-property",
            title: "Post Properties",
            path: "/admin/post-properties",
          },
          // {
          //   id: "fixed-property",
          //   title: "Fixed Properties",
          //   path: "/admin/properties",
          // },
        ],
      },
      {
        id: "dealers",
        title: "Dealers",
        icon: User2,
        children: [
          {
            id: "all-dealers",
            title: "All Dealers",
            path: "/admin/dealers",
          },
          {
            id: "add-dealer",
            title: "Add Dealer",
            path: "/admin/add-dealer",
          },
        ],
      },
      {
        id: "leads",
        title: "Leads",
        icon: Clipboard,
        children: [
          {
            id: "all-leads",
            title: "All Leads",
            path: "/admin/leads",
          },
          {
            id: "add-lead",
            title: "Add Lead",
            path: "/admin/add-lead",
          },
        ],
      },
      {
        id: "posts",
        title: "Posts",
        icon: Clipboard,
        children: [
          {
            id: "all-posts",
            title: "All Posts",
            path: "/admin/posts",
          },
          {
            id: "add-post",
            title: "Add Post",
            path: "/admin/add-post",
          },
        ],
      },
      {
        id: "citylisting",
        title: "City Listings",
        icon: LucideTowerControl,
        path: "/admin/city-listings",
      },
      {
        id: "users",
        title: "Users",
        icon: UserRound,
        path: "/admin/add-user",
      }
    ],
  },

  {
    title: "ADV. MANAGEMENT",
    items: [
      {
        id: "banner",
        title: "Banner",
        icon: ImagePlus,
        children: [
          {
            id: "banner-list",
            title: "All Banners",
            path: "/admin/banners",
          },
          {
            id: "add-banner",
            title: "Add Banner",
            path: "/admin/add-banner",
          },
        ],
      },
      {
        id: "project",
        title: "Project Listing",
        icon: ListCheck,
        path: "/admin/project-listing",
      }
    ],
  },
  {
    title: "CMS",
    items: [

      {
        id: "pages",
        title: "Pages",
        icon: Clipboard,
        path: "/admin/pages",
      },
      // {
      //   id: "blogs",
      //   title: "Blogs",
      //   icon: LucideBlocks,
      //   path: "/admin/blogs", 
      // },

        {
        id: "blogs",
        title: "Blogs",
        icon: LucideBlocks,
        children: [
          {
            id: "all-blogs",
            title: "All Blogs",
            path: "/admin/blogs",
          },
          {
            id: "add-blogs",
            title: "Add Blogs",
            path: "/admin/add-blogs",
          },
        ],
      },
    ],
  },
  {
    title: "Docs Request",
    items: [

      {
        id: "rents",
        title: "Rents",
        icon: ReceiptCent,
        path: "/admin/rents",
      },
      {
        id: "sale",
        title: "Sale",
        icon: ScalingIcon,
        path: "/admin/sale",  
      },
      {
        id: "partpayment",
        title: "Part Payment",
        icon: Coins,
        path: "/admin/partpayment",
      },
    ],
  },
];