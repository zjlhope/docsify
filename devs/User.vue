<template>
    <Dropdown class="user-menu" @on-click="btnLogout">
        <a href="javascript:void(0)">
            <Avatar shape="square" icon="ios-person" src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
        </a>
        <DropdownMenu slot="list">
            <DropdownItem name="logout">退出</DropdownItem>
        </DropdownMenu>
    </Dropdown>
</template>
<script>
    export default {
        methods: {
            btnLogout(name) {
                if (name === "logout") {
                    this.$curl.post("/api/logout")
                        .then(() => {
                            location.href = "login.html"
                        })
                }
            }
        }
    }
</script>