export const pythonCode = `import threading
import time
import random
import matplotlib.pyplot as plt

# Размер массива
ARRAY_SIZE = 10_000_000

# Генерация массива случайных чисел
print(f"Генерация массива из {ARRAY_SIZE:,} элементов...")
array = [random.randint(1, 100) for _ in range(ARRAY_SIZE)]
print("Массив сгенерирован.\\n")


def sum_part(arr, start, end, results, index):
    """Вычисляет сумму части массива и сохраняет результат."""
    partial_sum = 0
    for i in range(start, end):
        partial_sum += arr[i]
    results[index] = partial_sum


def single_thread_sum(arr):
    """Однопоточное вычисление суммы."""
    total = 0
    for val in arr:
        total += val
    return total


def multi_thread_sum(arr, num_threads):
    """Многопоточное вычисление суммы."""
    threads = []
    results = [0] * num_threads
    chunk_size = len(arr) // num_threads

    for i in range(num_threads):
        start = i * chunk_size
        end = start + chunk_size if i < num_threads - 1 else len(arr)
        t = threading.Thread(target=sum_part, args=(arr, start, end, results, i))
        threads.append(t)

    # Запуск всех потоков
    for t in threads:
        t.start()

    # Ожидание завершения всех потоков
    for t in threads:
        t.join()

    return sum(results)


# ======== Измерение производительности ========

results_table = []

# 1 поток (однопоточный режим)
start_time = time.time()
result_1 = single_thread_sum(array)
time_1 = time.time() - start_time
results_table.append((1, time_1, result_1))
print(f"1 поток:  сумма = {result_1:,}, время = {time_1:.4f} сек")

# 2 потока
start_time = time.time()
result_2 = multi_thread_sum(array, 2)
time_2 = time.time() - start_time
results_table.append((2, time_2, result_2))
print(f"2 потока: сумма = {result_2:,}, время = {time_2:.4f} сек")

# 4 потока
start_time = time.time()
result_4 = multi_thread_sum(array, 4)
time_4 = time.time() - start_time
results_table.append((4, time_4, result_4))
print(f"4 потока: сумма = {result_4:,}, время = {time_4:.4f} сек")

# ======== Построение графика ========

threads_list = [r[0] for r in results_table]
times_list = [r[1] for r in results_table]

plt.figure(figsize=(8, 5))
plt.bar(threads_list, times_list, color=['#6366f1', '#8b5cf6', '#a78bfa'],
        width=0.6, edgecolor='black', linewidth=0.5)
plt.xlabel('Количество потоков', fontsize=12)
plt.ylabel('Время выполнения (сек)', fontsize=12)
plt.title('Зависимость времени вычисления от числа потоков', fontsize=14)
plt.xticks(threads_list)
plt.grid(axis='y', alpha=0.3)
plt.tight_layout()
plt.savefig('thread_performance.png', dpi=150)
plt.show()

print("\\nГрафик сохранён как 'thread_performance.png'")
`;

export const cppCode = `#include <iostream>
#include <vector>
#include <thread>
#include <numeric>
#include <chrono>
#include <random>
#include <iomanip>

const int ARRAY_SIZE = 10'000'000;

// Функция для вычисления суммы части массива
void partial_sum(const std::vector<int>& arr, int start, int end, long long& result) {
    long long sum = 0;
    for (int i = start; i < end; ++i) {
        sum += arr[i];
    }
    result = sum;
}

// Однопоточное вычисление
long long single_thread_sum(const std::vector<int>& arr) {
    long long sum = 0;
    for (int val : arr) {
        sum += val;
    }
    return sum;
}

// Многопоточное вычисление
long long multi_thread_sum(const std::vector<int>& arr, int num_threads) {
    std::vector<std::thread> threads;
    std::vector<long long> results(num_threads, 0);
    int chunk_size = arr.size() / num_threads;

    for (int i = 0; i < num_threads; ++i) {
        int start = i * chunk_size;
        int end = (i == num_threads - 1) ? arr.size() : start + chunk_size;
        threads.emplace_back(partial_sum, std::ref(arr), start, end, std::ref(results[i]));
    }

    for (auto& t : threads) {
        t.join();
    }

    long long total = 0;
    for (long long r : results) {
        total += r;
    }
    return total;
}

int main() {
    // Генерация массива
    std::cout << "Генерация массива из " << ARRAY_SIZE << " элементов..." << std::endl;
    std::vector<int> arr(ARRAY_SIZE);
    std::mt19937 gen(42);
    std::uniform_int_distribution<> dist(1, 100);
    for (int& val : arr) {
        val = dist(gen);
    }
    std::cout << "Массив сгенерирован." << std::endl << std::endl;

    // 1 поток
    auto start = std::chrono::high_resolution_clock::now();
    long long sum1 = single_thread_sum(arr);
    auto end = std::chrono::high_resolution_clock::now();
    double time1 = std::chrono::duration<double>(end - start).count();
    std::cout << std::fixed << std::setprecision(4);
    std::cout << "1 поток:  сумма = " << sum1 << ", время = " << time1 << " сек" << std::endl;

    // 2 потока
    start = std::chrono::high_resolution_clock::now();
    long long sum2 = multi_thread_sum(arr, 2);
    end = std::chrono::high_resolution_clock::now();
    double time2 = std::chrono::duration<double>(end - start).count();
    std::cout << "2 потока: сумма = " << sum2 << ", время = " << time2 << " сек" << std::endl;

    // 4 потока
    start = std::chrono::high_resolution_clock::now();
    long long sum4 = multi_thread_sum(arr, 4);
    end = std::chrono::high_resolution_clock::now();
    double time4 = std::chrono::duration<double>(end - start).count();
    std::cout << "4 потока: сумма = " << sum4 << ", время = " << time4 << " сек" << std::endl;

    return 0;
}
`;
