import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/users/login',
    name: 'login',
    meta: { layout: 'empty' },
    component: () => import('@/views/auth/LoginPage.vue'),
  },
  {
    path: '/products/:id',
    name: 'product',
    // meta: { layout: 'empty' },
    component: () => import('@/views/product/_id/ProductDetailView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    meta: { layout: 'empty' },
    component: () => import('@/views/auth/RegisterPage.vue'),
  },
  {
    path: '/profiles/:id',
    name: 'profile-detail',
    props: {
      type: 'VIEW',
    },
    component: () => import('@/views/dashboard/ProfileSetting.vue'),
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    component: () => import('@/views/product/_id/ProductDetailView.vue'),
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/checkout/CheckoutFromCart.vue'),
  },
  {
    path: '/favorite-items',
    name: 'favorite-items',
    component: () => import('@/views/dashboard/FavoriteItems.vue'),
  },
  {
    path: '/checkout/:id',
    name: 'checkout-direct',
    component: () => import('@/views/checkout/CheckoutDirect.vue'),
  },
  {
    path: '/checkout-success/:id',
    name: 'checkout-success',
    component: () => import('@/views/checkout/CheckoutSuccess.vue'),
  },
  {
    path: '/tracking-order/:id',
    name: 'tracking-order',
    component: () => import('@/views/checkout/TrackingOrder.vue'),
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/SearchView.vue'),
  },
  {
    path: '/shop/:id',
    name: 'shop-detail',
    component: () => import('@/views/shop/ShopProfileView.vue'),
  },
  {
    path: '/categories/:id',
    name: 'category-products',
    component: () => import('@/views/ListCategoryProducts.vue'),
  },
  {
    path: '/categories/:id/sub_category/:subId',
    name: 'sub-category-products',
    component: () => import('@/views/ListCategoryProducts.vue'),
  },
  //create nested routes use for dashboard ex create & manage product
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { layout: 'dashboard' },
    component: () => import('@/views/dashboard/DashboardView.vue'),
    children: [
      {
        path: 'create-product',
        name: 'create-product',
        meta: { requiresAuth: true },
        component: () => import('@/views/dashboard/CreateProductView.vue'),
      },
      {
        path: 'create-brand',
        name: 'create-brand',
        meta: { requiresAuth: true },
        component: () => import('@/views/dashboard/CreateBrandView.vue'),
      },
      {
        path: 'create-category',
        name: 'create-category',
        meta: { requiresAuth: true },
        component: () => import('@/views/dashboard/CreateCategoryView.vue'),
      },
      {
        path: 'create-campaign',
        name: 'create-campaign',
        meta: { requiresAuth: true },
        component: () => import('@/views/dashboard/CreateCampaignView.vue'),
      },
      {
        path: 'update-campaign',
        name: 'update-campaign',
        meta: { requiresAuth: true },
        component: () => import('@/views/dashboard/UpdateCampaignView.vue'),
      },
      {
        path: 'update-product/:id',
        name: 'update-product',
        meta: { requiresAuth: true },
        component: () => import('@/views/dashboard/UpdateProductView.vue'),
      },
      {
        path: 'manage-product',
        name: 'manage-product',
        meta: { requiresAuth: true },
        component: () => import('@/views/dashboard/ProductManager.vue'),
      },
      {
        path: 'profile-settings',
        name: 'profile-settings',
        props: {
          type: 'SETTING',
        },
        meta: { requiresAuth: true },
        component: () => import('@/views/dashboard/ProfileSetting.vue'),
      },
      {
        path: 'favorite-items',
        name: 'favorite-items',
        meta: { requiresAuth: true },
        component: () => import('@/views/dashboard/FavoriteItems.vue'),
      },
    ],
  },
  {
    // catch all 404
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    meta: { layout: 'empty' },
    component: () => import('@/views/NotFoundPage.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
