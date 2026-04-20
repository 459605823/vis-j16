FROM nginx:alpine

# nginx.conf 和 dist 均通过 volume 挂载自宿主机，无需在此复制

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
