export default defineNuxtRouteMiddleware((to, from) => {
    const { user } = useAuth();

    // 类型断言更新
    const requiredPermission = to.meta.permission as
        | AccountPermission
        | undefined;

    // 如果页面没设置权限，直接放行
    if (requiredPermission === undefined) {
        return;
    }

    const userPermission = user.value?.permission || AccountPermission.USER;

    // 直接比较数字大小
    if (userPermission < requiredPermission) {
        // 比如：当前是 HELPER(3) < ADMIN(4)，则拦截
        if (to.fullPath === from.fullPath || !from.name) {
            return navigateTo('/');
        }
        return abortNavigation('权限不足');
    }
});
