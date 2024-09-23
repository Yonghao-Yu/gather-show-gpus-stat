// index.js
$(document).ready(function() {
    let interval = 10000;  // 刷新间隔 30 秒

    // 更新前端页面
    function updateContent(data) {
        console.log("更新内容的数据:", data);  // 调试信息

        // 隐藏加载动画并显示内容
        $('.loader').hide();
        $('.content').show();

        // 更新时间戳
        $('#datetime_str').text(data.datetime_str);

        // 清空之前的状态
        $('#statuses').empty();
        $('#errors').empty();

        // 显示每台机器的状态
        for (let url in data.statuses) {
            let machineData = data.statuses[url];
            let machineDiv = `<h2>机器: ${url}</h2>`;

            // GPU 信息表格
            machineDiv += `
                <h3>GPU 信息</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>名称</th>
                            <th>风扇速度 (%)</th>
                            <th>GPU 温度 (°C)</th>
                            <th>功耗 (W)</th>
                            <th>功耗限制 (W)</th>
                            <th>内存使用 (MB)</th>
                            <th>内存总量 (MB)</th>
                            <th>GPU 利用率 (%)</th>
                            <th>PCI-E 宽度</th>
                            <th>PCI-E 代数</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            machineData.gpu_info_list.forEach(function(gpu) {
                machineDiv += `
                    <tr>
                        <td>${gpu.index}</td>
                        <td>${gpu.name}</td>
                        <td>${gpu.fan_speed}</td>
                        <td>${gpu.temperature_gpu}</td>
                        <td>${gpu.power_draw}</td>
                        <td>${gpu.power_limit}</td>
                        <td>${gpu.memory_used}</td>
                        <td>${gpu.memory_total}</td>
                        <td>${gpu.utilization_gpu}</td>
                        <td>${gpu.pcie_width_current}</td>
                        <td>${gpu.pcie_gen_current}</td>
                    </tr>
                `;
            });

            machineDiv += `
                    </tbody>
                </table>
            `;

            // 进程信息表格
            machineDiv += `
                <h3>进程信息</h3>
                <table>
                    <thead>
                        <tr>
                            <th>全局索引</th>
                            <th>GPU ID</th>
                            <th>容器名称</th>
                            <th>进程启动时间</th>
                            <th>进程运行时间</th>
                            <th>PID (Host)</th>
                            <th>PID (Container)</th>
                            <th>进程名称</th>
                            <th>GPU 内存使用 (MB)</th>
                            <th>主内存使用 (MB)</th>
                            <th>命令</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            machineData.proc_info_list.forEach(function(proc) {
                machineDiv += `
                    <tr>
                        <td>${proc.global_index}</td>
                        <td>${proc.gpu_index}</td>
                        <td>${proc.container_name}</td>
                        <td>${proc.proc_start_time}</td>
                        <td>${proc.proc_running_time}</td>
                        <td>${proc.pid}</td>
                        <td>${proc.pid_in_container}</td>
                        <td>${proc.process_name}</td>
                        <td>${proc.gpu_memory_used}</td>
                        <td>${proc.main_memory_used}</td>
                        <td>${proc.command}</td>
                    </tr>
                `;
            });

            machineDiv += `
                    </tbody>
                </table>
            `;

            $('#statuses').append(machineDiv);
        }

        // 显示错误信息
        if (data.errors.length > 0) {
            let errorHtml = `<h2>错误信息</h2><ul>`;
            data.errors.forEach(function(error) {
                errorHtml += `<li>${error}</li>`;
            });
            errorHtml += `</ul>`;
            $('#errors').append(errorHtml);
        }
    }

    // 请求 GPU 状态
    function getStatus() {
        $.ajax({
            type: "GET",
            url: "/status",
            dataType: "json",
            success: function(data) {
                console.log("成功获取数据:", data);
                updateContent(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("获取数据失败:", textStatus, errorThrown);
                $('.loader p').text("加载数据失败，请稍后重试。");
            }
        });
    }

    // 定时刷新
    setInterval(getStatus, interval);
    getStatus();  // 初次加载时立即获取数据
});
