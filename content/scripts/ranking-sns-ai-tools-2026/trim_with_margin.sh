#!/bin/bash
FFMPEG="/mnt/c/Users/tench/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-7.1.1-full_build/bin/ffmpeg.exe"
MARGIN=0.05  # 有音の最初を残す秒数

input_file="$1"
output_file="$2"

# 無音区間を検出してパース
silence_data=$("$FFMPEG" -i "$input_file" -af silencedetect=n=-40dB:d=0.1 -f null - 2>&1)

# ファイルの長さを取得
duration=$(echo "$silence_data" | grep "Duration:" | head -1 | sed 's/.*Duration: \([0-9:.]*\).*/\1/' | awk -F: '{print $1*3600 + $2*60 + $3}')

# silence_start と silence_end を抽出
starts=($(echo "$silence_data" | grep "silence_start:" | sed 's/.*silence_start: \([0-9.]*\).*/\1/'))
ends=($(echo "$silence_data" | grep "silence_end:" | sed 's/.*silence_end: \([0-9.]*\).*/\1/'))

# 有音区間を計算（無音の終了+MARGINから次の無音の開始まで）
filter_parts=()
current_pos=0

for i in "${!starts[@]}"; do
  s_start=${starts[$i]}
  s_end=${ends[$i]}
  
  # 無音終了位置をMARGIN分手前に調整（有音の最初を残す）
  adjusted_end=$(echo "$s_end - $MARGIN" | bc)
  
  # 調整後の終了が開始より前にならないようにする
  if (( $(echo "$adjusted_end < $s_start" | bc -l) )); then
    adjusted_end=$s_start
  fi
  
  # 有音区間を追加（current_posから無音開始まで）
  if (( $(echo "$s_start > $current_pos" | bc -l) )); then
    filter_parts+=("between(t,$current_pos,$s_start)")
  fi
  
  # 次の開始位置を調整後の無音終了に設定
  current_pos=$adjusted_end
done

# 最後の有音区間を追加
if (( $(echo "$duration > $current_pos" | bc -l) )); then
  filter_parts+=("between(t,$current_pos,$duration)")
fi

# フィルター文字列を作成
filter_str=$(IFS='+'; echo "${filter_parts[*]}")

# ffmpegで有音区間だけを抽出
"$FFMPEG" -y -i "$input_file" -af "aselect='$filter_str',asetpts=N/SR/TB" "$output_file" 2>/dev/null

echo "Done: $output_file"
