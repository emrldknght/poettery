export const MOCK_DOM =
`
<!DOCTYPE html>
  <html>
  <body>
    <form name="formStih1"><textarea name="TextStih"></textarea></form>
    
    <textarea class="stih" name="TextStih"  id="TextStih1"></textarea>
    
    <form name="formStih2">
      <textarea name="TextStih"></textarea>
    </form>
    
    <form name="recordstih">
      <input name="targettext">
      <select name="rubrika"></select>
      <select name="targetpole"></select>
      <input name="konkurs_id">
      <input name="konkurs_title">
    </form>
    <div id="ContainerComment0"></div>
    <div id="ContainerComment1"></div>
    <div id="ContainerAnaliz1"></div>
    <div id="ContainerAnaliz1f"></div>
    <div id="ContainerTemplate1"></div>
    <div id="ContainerFlag1"></div>
    
    <table class="global-table inline bl ov" >
<tbody id="global-table1">
<tr>
<td colspan=3>
<div id="ContainerFlag1" width="100%" class="text-main border-top pd02"></div>
</td>
</tr>

<tr>
<td colspan=3>
<div id="ContainerComment1" width="100%" class="text-main  border-bottom pd02"></div>
</td>
</tr>

<tr class="border-table">
<td width="40%" valign=top class="ov">
 <form name="formStih1">
<textarea class="stih" name="TextStih"  id="TextStih1" placeholder="Вставьте стихотворение в это поле и нажмите кнопку «Анализ стихотворения». Заголовок, нумерацию и прочие примечания лучше убрать."  style="width: 100%; rows: 60;" valign=top onfocus="hiderecordstih()" readonly=""></textarea>
</form>
<div id="postscriptum" width="100%" class="text-main" style="padding: 10 10 10 10;"></div>
<div id="vopros" width="100%" class="text-main" style="padding: 10 10 10 10; "></div>
<div id="otvet" width="100%" class="text-main" style="padding: 10 10 10 10;"></div>

</td>
<td  width="25%" valign=top  align=left class="ov" style="border: 1px solid #e0e0e0; padding-left:10px;" >
<div id="ContainerTemplate1" class="text-main lh"></div>
</td>
<td  width="35%" valign=top  align=left class="ov">
<div id="ContainerAnaliz1"  class="text-main lh pd1">В альманахе <a href="https://vpoezii.online" target="_blank" style="text-decoration: none;">«Венец поэзии»</a> публикуются только классические стихотворения, то есть имеющие регулярно выдержанный размер, чётко выраженный ритм и точные рифмы. Для отбора стихотворений редакция организовала ряд конкурсов и марафонов. <div id="konkurs_title_note" style="display:inline-block;"></div><br><br>Для предварительной проверки стихотворений создана интеллектуальная система Fet.Online, с помощью которой вы можете получить автоматизированный анализ своего стихотворения. При положительном результате анализа появится кнопка «Отправить стихотворение в редакцию». Далее нужно будет заполнить анкету с целью сохранения ваших авторских прав. <br><br>Для получения анализа вставьте стихотворение в первое поле и нажмите кнопку «Анализ стихотворения». Желаем удачи!</div>
<div id="ContainerAnaliz1f"  class="text-main lh pd1"></div>
<div id="openrecordstih2" style="display:none">
<input type="button" style="margin-left: 10px; margin-bottom: 10px;" class="button"  onclick="openrecordstih()" value="Отправить в редакцию"/>
</div>
</td>
</tr>
</tbody>
</table>
    
    
    <div id="postscriptum"></div>
    <div id="vopros"></div>
    <div id="otvet"></div>
    <div id="adminPanel"></div>
    <div id="ustav_konkurs"></div>
    <div id="ustav_music_venec"></div>
    <div id="ustav"></div>
    <div id="konkurs_title_note"></div>
    <input id="level-tonic" type="radio">
    <input id="level-full" type="radio" checked>
    <input id="level-strof" type="radio">
    <input id="level-strok" type="radio">
    <input id="FileAccent" type="checkbox">
    <input id="SaveRecord" type="checkbox">
    <input id="LentaMode" type="checkbox">
    <input id="picfile" type="file">
    
    <input id="BallClassicManual" type="text" value="0">
    <input id="BallContentManual" type="text" value="0">
    
    <div id="TriCodLegend"></div>
    <div id="slog"></div>
    <div id="TriCodRitm"></div>
  </body>
  </html>
`