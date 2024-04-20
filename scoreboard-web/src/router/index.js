import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: '',
        component: () => import('@/pages/index.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
