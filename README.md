 <!-- <%allAlbum.forEach(function(elem){%>
        <div class="albumPoster" title="get all songs">
          <div class="albumImage">
            <a href="/album/<%=elem._id%>">
              <img src="/audioPosterFile/<%=elem.albumPoster%>" alt="poster" />
              <h4><%=elem.albumName%></h4>
              <h4 id="subheading"><%=elem.albumCategory%></h4>
            </a>
          </div>
        </div>
        <%})%> -->